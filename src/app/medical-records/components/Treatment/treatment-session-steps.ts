const SESSION_VISIBLE_RANGE = 2

export function buildSessionSteps(
  total: number,
  active: number
): (number | "ellipsis")[] {
  const steps: (number | "ellipsis")[] = []
  const visible = new Set<number>()

  visible.add(1)
  visible.add(total)

  for (
    let i = Math.max(1, active - SESSION_VISIBLE_RANGE);
    i <= Math.min(total, active + SESSION_VISIBLE_RANGE);
    i++
  ) {
    visible.add(i)
  }

  let prev = 0
  for (let i = 1; i <= total; i++) {
    if (!visible.has(i)) continue
    if (prev > 0 && i - prev > 1) steps.push("ellipsis")
    steps.push(i)
    prev = i
  }

  return steps
}
