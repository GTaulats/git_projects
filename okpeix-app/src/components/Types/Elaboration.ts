// Methods aplicable to products.

export type Elaboration = {
  elaborationId: string;
  name: string; // Freeze, thaw, slice, cut, etc.
  alias: string; // Other known names
  type: string[]; // Types which the method is aplicable to (Fish, seafood, etc., all)
  imageURL: string;
  details: string;
};
