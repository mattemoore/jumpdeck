export interface SignatureDetailModel {
  label: string;
  value: string;
  id: string;
  type: SignatureDetailType;
}

export enum SignatureDetailType {
  Text,
  Email,
  Phone,
  URL
}

export function CreateInitialSignatureDetails(): SignatureDetailModel[] {
  return [
    {
      label: 'Full name',
      id: 'name',
      value: 'Matthew Moore',
      type: SignatureDetailType.Text
    },
    {
      label: 'Title',
      id: 'title',
      value: 'The Godfather',
      type: SignatureDetailType.Text
    },
    {
      label: 'Company',
      id: 'company',
      value: 'Juksoft Inc.',
      type: SignatureDetailType.Text
    },
    {
      label: 'Phone',
      id: 'phone',
      value: '613-261-7212',
      type: SignatureDetailType.Phone
    },
    {
      label: 'Website',
      id: 'website',
      value: 'http://www.google.com',
      type: SignatureDetailType.URL
    },
    {
      label: 'Email',
      id: 'email',
      value: 'matt.e.moore@gmail.com',
      type: SignatureDetailType.Email
    }
  ];
}
