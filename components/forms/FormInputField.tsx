// Created by Kien AI (leejungkiin@gmail.com)
import React from 'react';
import { Controller, type Control, type FieldPath, type FieldValues, type RegisterOptions } from 'react-hook-form';
import { FormInput, type FormInputProps } from './FormInput';

export interface FormInputFieldProps<TFieldValues extends FieldValues>
  extends Omit<FormInputProps, 'value' | 'onChangeText'> {
  name: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
}

export function FormInputField<TFieldValues extends FieldValues>({
  name,
  control,
  rules,
  helperText,
  error,
  ...rest
}: FormInputFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState }) => (
        <FormInput
          {...rest}
          value={value}
          onChangeText={(text) => onChange(text)}
          helperText={helperText}
          error={error ?? fieldState.error?.message}
        />
      )}
    />
  );
}


