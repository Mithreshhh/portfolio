# CompareSlider

`components/CompareSlider.tsx` exports `CompareSlider` (one image, mono on the left, colour on the right, draggable divider with a keyboard-accessible range handle) and `CompareGallery` (first image in the slider, remaining images as plain blocks). Both are dependency-free client components. To integrate into `app/projects/[slug]/_components/ProjectDetails.tsx`, add `import { CompareGallery } from '@/components/CompareSlider';`, drop the now-unused `ExternalLink` and `Image` imports if nothing else uses them, and replace the whole `<div className="grid gap-3 max-w-[1000px] mx-auto" id="images">…</div>` block with:

```tsx
<CompareGallery
    id="images"
    images={project.images?.length ? project.images : [project.thumbnail]}
    alt={`${project.title} screenshot`}
    className="mx-auto max-w-[1000px]"
/>
```

The `id="images"` is kept so the existing `#images > div` GSAP scroll-in in ProjectDetails keeps working unchanged.
