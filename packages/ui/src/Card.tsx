export function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="border border-slate-300 p-4 rounded-lg bg-[#f3f3f3]">
      <h1 className="text-xl border-b pb-2 font-medium">
        {title}
      </h1>
      <div>{children}</div>
    </div>
  );
}
