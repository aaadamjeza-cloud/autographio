import cs from "./cs";
import en from "./en";
import sk from "./sk";
import fr from "./fr";
import type { Locale } from "./locale";
import type { Dictionary } from "./types";

export const dictionaries: Record<Locale, Dictionary> = { cs, en, sk, fr };
