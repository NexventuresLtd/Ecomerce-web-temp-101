// "Others"/"OTHERS"/"others" is the catch-all bucket at every level of the
// category tree. Wherever a level is rendered, it goes after the real names.
// Stable sort, so everything else keeps its database order.
export const isOthers = (name?: string | null) =>
    (name ?? '').trim().toLowerCase() === 'others';

export const othersLast = <T extends { name: string }>(items?: T[] | null): T[] =>
    (items ?? []).slice().sort((a, b) => Number(isOthers(a.name)) - Number(isOthers(b.name)));
