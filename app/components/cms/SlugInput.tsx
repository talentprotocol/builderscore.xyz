"use client";

import { TextInput, useField } from "@payloadcms/ui";
import { kebabCase } from "lodash";
import { TextField } from "payload";
import { useEffect, useRef } from "react";

export type SlugInputProps = TextField & {
  trackingField: string;
};

export function SlugInput(props: SlugInputProps) {
  const { trackingField, required, admin: { readOnly } = {} } = props;

  const { value: slugValue = "", setValue: setSlugValue } = useField<string>({
    path: "slug",
  });

  const { value: trackingFieldValue } = useField<string>({
    path: trackingField,
  });

  const prevTrackingFieldValueRef = useRef(trackingFieldValue);
  const stopTrackingRef = useRef(false);

  useEffect(() => {
    if (!trackingField || stopTrackingRef.current) {
      return;
    }

    if (trackingFieldValue === prevTrackingFieldValueRef.current) {
      return;
    }

    const prevSlugValue = kebabCase(prevTrackingFieldValueRef.current);
    prevTrackingFieldValueRef.current = trackingFieldValue;

    if (prevSlugValue !== slugValue) {
      return;
    }

    setSlugValue(kebabCase(trackingFieldValue));
  }, [setSlugValue, slugValue, trackingField, trackingFieldValue]);

  return (
    <div>
      <TextInput
        path="slug"
        label="Slug"
        hasMany={false}
        description={
          slugValue
            ? `Auto generated based on ${trackingField}`
            : `Will be auto-generated from ${trackingField} when saved`
        }
        value={slugValue}
        onChange={(e) => {
          setSlugValue(e.target.value);
          stopTrackingRef.current = true;
        }}
        readOnly={readOnly}
        required={required}
      />
    </div>
  );
}
