import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudUpload } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function UploadZone() {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await apiRequest("POST", "/api/files/upload", formData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Successful",
        description: `File "${data.originalName}" has been uploaded and is being processed.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/activity"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      setIsUploading(false);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload file. Please try again.",
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsUploading(true);
      uploadMutation.mutate(acceptedFiles[0]);
    }
  }, [uploadMutation]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <Card data-testid="card-upload-zone">
      <CardHeader>
        <CardTitle data-testid="text-upload-title">Quick Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center upload-zone hover:border-primary/50 transition-colors cursor-pointer ${
            isDragActive ? "border-primary bg-primary/5" : "border-border"
          } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
          data-testid="dropzone-area"
        >
          <input {...getInputProps()} />
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CloudUpload className="w-8 h-8 text-primary" />
          </div>
          
          {isUploading ? (
            <>
              <h4 className="text-lg font-medium text-foreground mb-2" data-testid="text-uploading">
                Uploading...
              </h4>
              <p className="text-muted-foreground mb-4">Please wait while your file is being uploaded</p>
            </>
          ) : isDragActive ? (
            <>
              <h4 className="text-lg font-medium text-foreground mb-2" data-testid="text-drop-files">
                Drop your files here
              </h4>
              <p className="text-muted-foreground mb-4">Release to upload</p>
            </>
          ) : (
            <>
              <h4 className="text-lg font-medium text-foreground mb-2" data-testid="text-upload-instruction">
                Drop your Excel files here
              </h4>
              <p className="text-muted-foreground mb-4">or click to browse</p>
              <Button 
                type="button"
                disabled={isUploading}
                data-testid="button-choose-files"
              >
                Choose Files
              </Button>
            </>
          )}
          
          <p className="text-xs text-muted-foreground mt-3" data-testid="text-file-requirements">
            Supports: .xlsx, .xls, .csv (Max 10MB)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
