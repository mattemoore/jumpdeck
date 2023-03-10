export interface SignatureImageModel {
  label: string;
  url: string;
}

export function CreateInitialImages(): SignatureImageModel[] {
  return [
    {
      label: 'Logo',
      url: ''
    }
  ];
}
