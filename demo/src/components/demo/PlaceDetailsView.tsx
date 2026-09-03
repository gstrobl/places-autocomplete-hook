import { ReactNode } from 'react';
import { PlaceDetails } from 'places-autocomplete-hook';

interface PlaceDetailsViewProps {
  details: PlaceDetails;
}

function DetailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-line-soft bg-bg-tint p-4">
      <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-ink">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <p className="mb-1 text-sm text-ink-soft">
      <span className="font-medium text-ink">{label}:</span> {children}
    </p>
  );
}

function BoolItem({ label, value }: { label: string; value: boolean }) {
  return (
    <span className="text-sm text-ink-soft">
      {label}:{' '}
      <span className={value ? 'font-medium text-accent' : 'text-ink-mute'}>
        {value ? 'Yes' : 'No'}
      </span>
    </span>
  );
}

export function PlaceDetailsView({ details }: PlaceDetailsViewProps) {
  const hasContact =
    details.internationalPhoneNumber || details.nationalPhoneNumber || details.websiteUri;
  const hasBusinessInfo =
    details.businessStatus || details.currentOpeningHours || details.regularOpeningHours;
  const diningAndAmenities: Array<[string, boolean | undefined]> = [
    ['Delivery', details.delivery],
    ['Dine In', details.dineIn],
    ['Takeout', details.takeout],
    ['Reservable', details.reservable],
    ['Serves Beer', details.servesBeer],
    ['Serves Wine', details.servesWine],
    ['Cocktails', details.servesCocktails],
    ['Outdoor Seating', details.outdoorSeating],
    ['Live Music', details.liveMusic],
    ['Allows Dogs', details.allowsDogs],
    ['Good for Children', details.goodForChildren],
    ['Good for Groups', details.goodForGroups],
    ['Restroom', details.restroom],
  ];
  const hasDiningInfo = diningAndAmenities.some(([, value]) => value !== undefined);

  return (
    <div className="space-y-4">
      <DetailSection title="Basic Information">
        <DetailRow label="Address">{details.formattedAddress}</DetailRow>
        {details.displayName?.text && (
          <DetailRow label="Display Name">{details.displayName.text}</DetailRow>
        )}
        {details.name && <DetailRow label="Name">{details.name}</DetailRow>}
        {details.rating !== undefined && (
          <DetailRow label="Rating">
            {details.rating} ★
            {details.userRatingCount !== undefined && (
              <span className="text-ink-mute"> ({details.userRatingCount} reviews)</span>
            )}
          </DetailRow>
        )}
        {details.priceLevel && <DetailRow label="Price Level">{details.priceLevel}</DetailRow>}
      </DetailSection>

      <DetailSection title="Location">
        <DetailRow label="Coordinates">
          {details.location.latitude.toFixed(6)}, {details.location.longitude.toFixed(6)}
        </DetailRow>
        {details.plusCode?.globalCode && (
          <DetailRow label="Plus Code">{details.plusCode.globalCode}</DetailRow>
        )}
        {details.googleMapsUri && (
          <a
            href={details.googleMapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent underline transition-colors hover:text-accent-soft"
          >
            View on Google Maps →
          </a>
        )}
      </DetailSection>

      {hasContact && (
        <DetailSection title="Contact">
          {details.internationalPhoneNumber && (
            <DetailRow label="Phone">{details.internationalPhoneNumber}</DetailRow>
          )}
          {details.nationalPhoneNumber && (
            <DetailRow label="National Phone">{details.nationalPhoneNumber}</DetailRow>
          )}
          {details.websiteUri && (
            <a
              href={details.websiteUri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-accent underline transition-colors hover:text-accent-soft"
            >
              Visit Website →
            </a>
          )}
        </DetailSection>
      )}

      {hasBusinessInfo && (
        <DetailSection title="Business Information">
          {details.businessStatus && <DetailRow label="Status">{details.businessStatus}</DetailRow>}
          {details.currentOpeningHours?.openNow !== undefined && (
            <DetailRow label="Open Now">
              <span className={details.currentOpeningHours.openNow ? 'text-accent' : ''}>
                {details.currentOpeningHours.openNow ? 'Yes' : 'No'}
              </span>
            </DetailRow>
          )}
          {details.regularOpeningHours?.weekdayDescriptions && (
            <div className="mt-2">
              <p className="mb-1 text-sm font-medium text-ink">Opening Hours:</p>
              <ul className="space-y-1 font-mono text-xs text-ink-mute">
                {details.regularOpeningHours.weekdayDescriptions.map(day => (
                  <li key={day}>{day}</li>
                ))}
              </ul>
            </div>
          )}
        </DetailSection>
      )}

      {hasDiningInfo && (
        <DetailSection title="Dining & Amenities">
          <div className="grid grid-cols-2 gap-2">
            {diningAndAmenities.map(
              ([label, value]) =>
                value !== undefined && <BoolItem key={label} label={label} value={value} />,
            )}
          </div>
        </DetailSection>
      )}

      {(details.parkingOptions || details.paymentOptions) && (
        <DetailSection title="Parking & Payment">
          {details.parkingOptions && (
            <div className="mb-2 text-sm text-ink-soft">
              <p className="font-medium text-ink">Parking:</p>
              <ul className="ml-4 mt-1 space-y-1">
                {details.parkingOptions.freeStreetParking && <li>• Free Street Parking</li>}
                {details.parkingOptions.freeParkingLot && <li>• Free Parking Lot</li>}
              </ul>
            </div>
          )}
          {details.paymentOptions && (
            <div className="text-sm text-ink-soft">
              <p className="font-medium text-ink">Payment:</p>
              <ul className="ml-4 mt-1 space-y-1">
                {details.paymentOptions.acceptsCreditCards && <li>• Credit Cards</li>}
                {details.paymentOptions.acceptsDebitCards && <li>• Debit Cards</li>}
                {details.paymentOptions.acceptsCashOnly && <li>• Cash Only</li>}
                {details.paymentOptions.acceptsNfc && <li>• NFC Payments</li>}
              </ul>
            </div>
          )}
        </DetailSection>
      )}

      {details.accessibilityOptions && (
        <DetailSection title="Accessibility">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {details.accessibilityOptions.wheelchairAccessibleParking && (
              <BoolItem label="Wheelchair Accessible Parking" value />
            )}
            {details.accessibilityOptions.wheelchairAccessibleEntrance && (
              <BoolItem label="Wheelchair Accessible Entrance" value />
            )}
            {details.accessibilityOptions.wheelchairAccessibleRestroom && (
              <BoolItem label="Wheelchair Accessible Restroom" value />
            )}
            {details.accessibilityOptions.wheelchairAccessibleSeating && (
              <BoolItem label="Wheelchair Accessible Seating" value />
            )}
          </div>
        </DetailSection>
      )}

      {details.photos && details.photos.length > 0 && (
        <DetailSection title={`Photos (${details.photos.length})`}>
          <p className="text-sm text-ink-soft">
            {details.photos.length} photo{details.photos.length !== 1 ? 's' : ''} available
            {details.photos[0]?.authorAttributions?.[0]?.displayName && (
              <span className="mt-1 block text-xs text-ink-mute">
                Sample by: {details.photos[0].authorAttributions[0].displayName}
              </span>
            )}
          </p>
        </DetailSection>
      )}

      {details.reviews && details.reviews.length > 0 && (
        <DetailSection title={`Recent Reviews (${details.reviews.length})`}>
          <div className="max-h-64 space-y-3 overflow-y-auto">
            {details.reviews.slice(0, 3).map((review, index) => (
              <div
                key={review.name ?? index}
                className="rounded-lg border border-line-soft bg-bg-elev p-3"
              >
                {review.rating !== undefined && (
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-semibold text-accent">{review.rating} ★</span>
                    {review.authorAttributions?.displayName && (
                      <span className="text-xs text-ink-mute">
                        by {review.authorAttributions.displayName}
                      </span>
                    )}
                  </div>
                )}
                {review.text?.text && <p className="text-sm text-ink-soft">{review.text.text}</p>}
                {review.relativePublishTimeDescription && (
                  <p className="mt-1 text-xs text-ink-mute">
                    {review.relativePublishTimeDescription}
                  </p>
                )}
              </div>
            ))}
          </div>
        </DetailSection>
      )}

      {details.editorialSummary?.text && (
        <DetailSection title="Editorial Summary">
          <p className="text-sm text-ink-soft">{details.editorialSummary.text}</p>
        </DetailSection>
      )}

      {details.types && details.types.length > 0 && (
        <DetailSection title="Place Types">
          <div className="flex flex-wrap gap-2">
            {details.types.map(type => (
              <span
                key={type}
                className="rounded-full border border-line px-2.5 py-1 font-mono text-xs text-ink-soft"
              >
                {type}
              </span>
            ))}
          </div>
          {details.primaryType && (
            <p className="mt-2 text-sm text-ink-soft">
              <span className="font-medium text-ink">Primary Type:</span> {details.primaryType}
            </p>
          )}
        </DetailSection>
      )}

      {details.addressComponents && details.addressComponents.length > 0 && (
        <DetailSection title="Address Components">
          <div className="space-y-2">
            {details.addressComponents.map((component, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="min-w-[100px] rounded bg-bg-elev px-2 py-1 font-mono text-xs text-ink-mute">
                  {component.types?.join(', ') || 'N/A'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-ink">{component.longText}</div>
                  {component.shortText !== component.longText && (
                    <div className="text-xs text-ink-mute">{component.shortText}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DetailSection>
      )}
    </div>
  );
}
