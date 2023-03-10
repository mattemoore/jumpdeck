import { atom, type RecoilState } from 'recoil';
import {
  CreateInitialSignatureDetails,
  type SignatureDetailModel,
} from '../types/SignatureDetailModel';

export const signatureDetailsState: RecoilState<SignatureDetailModel[]> = atom({
  key: 'signatureDetailState', // unique ID (with respect to other atoms/selectors)
  default: CreateInitialSignatureDetails(), // default value (aka initial value)
});
