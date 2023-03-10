import { atom, type RecoilState } from 'recoil';
import {
  CreateInitialImages,
  type SignatureImageModel,
} from '~/core/signitto/types/SingatureImageModel';

export const signatureImageState: RecoilState<SignatureImageModel[]> = atom({
  key: 'signatureImageState', // unique ID (with respect to other atoms/selectors)
  default: CreateInitialImages(), // default value (aka initial value)
});
