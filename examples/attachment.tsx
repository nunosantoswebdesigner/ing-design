import { Spinner } from "@/components/ui/spinner";
import { FileTextIcon, ImageIcon, Trash2Icon, XIcon } from "lucide-react";
import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentGroup, AttachmentMedia, AttachmentTitle, AttachmentTrigger } from "@/components/ui/attachment";

export const AttachmentDemo = () => (
    <div className="flex flex-col gap-6 max-w-xl">
      
      {/* States */}
      <div className="flex flex-wrap gap-3">
        {/* Done */}
        <Attachment state="done">
          <AttachmentMedia><FileTextIcon /></AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>report.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 2.4 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions><AttachmentAction aria-label="Remove"><XIcon /></AttachmentAction></AttachmentActions>
          <AttachmentTrigger />
        </Attachment>
        {/* Uploading */}
        <Attachment state="uploading">
          <AttachmentMedia><Spinner size="sm" /></AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>uploading.zip</AttachmentTitle>
            <AttachmentDescription>Uploading… 34%</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions><AttachmentAction aria-label="Cancel"><XIcon /></AttachmentAction></AttachmentActions>
        </Attachment>
        {/* Error */}
        <Attachment state="error">
          <AttachmentMedia><FileTextIcon /></AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>failed.docx</AttachmentTitle>
            <AttachmentDescription>Upload failed</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions><AttachmentAction variant="destructive" aria-label="Remove"><Trash2Icon /></AttachmentAction></AttachmentActions>
        </Attachment>
      </div>

      {/* Sizes */}
      <div className="flex flex-wrap items-center gap-3">
        <Attachment size="default">
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>default.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 1.2 MB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment size="sm">
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>small.pdf</AttachmentTitle>
            <AttachmentDescription>PDF · 1.2 MB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment size="xs">
          <AttachmentMedia>
            <FileTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>xs.pdf</AttachmentTitle>
            <AttachmentDescription>PDF</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </div>

      {/* Image variant vertical */}
      <div className="flex flex-wrap gap-3">
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <ImageIcon className="size-6 text-muted-foreground" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>photo.jpg</AttachmentTitle>
            <AttachmentDescription>JPG · 3.8 MB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment orientation="vertical">
          <AttachmentMedia variant="image">
            <ImageIcon className="size-6 text-muted-foreground" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>screenshot.png</AttachmentTitle>
            <AttachmentDescription>PNG · 512 KB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </div>

      {/* Group */}
      <AttachmentGroup>
        {["data.csv", "summary.pdf", "notes.txt", "archive.zip"].map((name) => (
          <Attachment key={name} size="sm">
            <AttachmentMedia>
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{name}</AttachmentTitle>
              <AttachmentDescription>Ready</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        ))}
      </AttachmentGroup>
    </div>
  );
