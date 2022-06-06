import { useTrackSignedInUser } from './use-track-signed-in-user';
import { useTrackScreenViews } from './use-track-screen-views';

export function useAnalyticsTracking() {
  useTrackSignedInUser();
  useTrackScreenViews();
}
