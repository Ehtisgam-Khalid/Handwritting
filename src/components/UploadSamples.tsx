import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, CheckCircle2 } from 'lucide-react';
import { analyzeHandwriting, HandwritingStyle } from '../services/aiService';
import { cn } from '../lib/utils';

interface UploadSamplesProps {
  onComplete: (style: HandwritingStyle) => void;
}

export default function UploadSamples({ onComplete }: UploadSamplesProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 5
  } as any);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const startAnalysis = async () => {
    if (files.length === 0) return;
    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert all files to base64
      const base64Images = await Promise.all(files.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }));

      const style = await analyzeHandwriting(base64Images);
      onComplete(style);
    } catch (err: any) {
      setError(err.message || "Failed to analyze handwriting. Please try again.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-12">
        <h2 className="text-3xl font-bold uppercase tracking-tighter mb-2">1. Upload Samples</h2>
        <p className="text-[#666] italic">Provide clear images of your handwriting on plain white paper.</p>
      </div>

      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed border-[#141414] rounded-3xl p-12 text-center transition-colors cursor-pointer",
          isDragActive ? "bg-[#141414] text-[#E4E3E0]" : "hover:bg-[#d4d3d0]"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-4" size={48} />
        <p className="text-xl font-medium mb-2 uppercase">Drag & Drop samples here</p>
        <p className="text-sm opacity-60">Supported formats: JPG, PNG (Max 5 images)</p>
      </div>

      {previews.length > 0 && (
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
          {previews.map((preview, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-[#141414]">
              <img src={preview} alt="Sample" className="w-full h-full object-cover" />
              <button
                onClick={() => removeFile(i)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full text-black opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-xl flex items-center gap-2">
          <X size={20} /> {error}
        </div>
      )}

      <div className="mt-12 flex justify-end">
        <button
          disabled={files.length === 0 || isAnalyzing}
          onClick={startAnalysis}
          className="px-8 py-4 bg-[#141414] text-[#E4E3E0] rounded-full text-lg font-medium hover:bg-[#333] transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>Analyzing Style <Loader2 className="animate-spin" size={20} /></>
          ) : (
            <>Extract DNA Style <CheckCircle2 size={20} /></>
          )}
        </button>
      </div>
    </div>
  );
}
