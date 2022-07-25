import { useTrackSignedInUser } from './use-track-signed-in-user';
import { useTrackScreenViews } from './use-track-screen-views';

/**
 * @name useAnalyticsTracking
 * @description Hook to start tracking using other Analytics hooks
 */
export function useAnalyticsTracking() {
  useTrackSignedInUser();
  useTrackScreenViews();
}
