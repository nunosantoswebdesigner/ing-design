import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from "@/components/ui/native-select";

export const NativeSelectDemo = () => (
    <div className="flex flex-col gap-4">
      {/* Default */}
      <NativeSelect defaultValue="">
        <NativeSelectOption value="" disabled>Select a framework</NativeSelectOption>
        <NativeSelectOption value="next">Next.js</NativeSelectOption>
        <NativeSelectOption value="remix">Remix</NativeSelectOption>
        <NativeSelectOption value="astro">Astro</NativeSelectOption>
        <NativeSelectOption value="vite">Vite</NativeSelectOption>
      </NativeSelect>
      {/* With opt-groups */}
      <NativeSelect defaultValue="">
        <NativeSelectOption value="" disabled>Select a country</NativeSelectOption>
        <NativeSelectOptGroup label="Europe">
          <NativeSelectOption value="pt">Portugal</NativeSelectOption>
          <NativeSelectOption value="de">Germany</NativeSelectOption>
          <NativeSelectOption value="fr">France</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Americas">
          <NativeSelectOption value="us">United States</NativeSelectOption>
          <NativeSelectOption value="br">Brazil</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
      {/* Small */}
      <NativeSelect size="sm" defaultValue="next">
        <NativeSelectOption value="next">Next.js</NativeSelectOption>
        <NativeSelectOption value="remix">Remix</NativeSelectOption>
        <NativeSelectOption value="astro">Astro</NativeSelectOption>
      </NativeSelect>
      {/* Disabled */}
      <NativeSelect disabled defaultValue="next"><NativeSelectOption value="next">Next.js</NativeSelectOption></NativeSelect>
      {/* Invalid */}
      <NativeSelect aria-invalid defaultValue="">
        <NativeSelectOption value="" disabled>Required field</NativeSelectOption>
        <NativeSelectOption value="next">Next.js</NativeSelectOption>
      </NativeSelect>
    </div>
  );
