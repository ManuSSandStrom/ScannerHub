export default function BrandMark() {
  return (
    <div className="relative grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-slate-950 shadow-card">
      <div className="absolute inset-[4px] rounded-[18px] bg-gradient-to-br from-[#ff7a59] to-[#14b8a6]" />
      <div className="relative grid h-7 w-7 grid-cols-2 gap-1">
        <span className="rounded-md bg-[#fff9f2]" />
        <span className="rounded-md bg-[#fff9f2]" />
        <span className="rounded-md bg-[#fff9f2]" />
        <span className="rounded-md bg-slate-950" />
      </div>
    </div>
  );
}
