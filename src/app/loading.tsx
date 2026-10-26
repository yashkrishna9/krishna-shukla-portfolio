import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <Container className="py-24">
      <div className="skeleton h-14 w-2/3 max-w-xl rounded-xl" />
      <div className="skeleton mt-6 h-5 w-full max-w-2xl rounded-lg" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-52 rounded-2xl" />
        ))}
      </div>
      <span className="sr-only">Loading</span>
    </Container>
  );
}
