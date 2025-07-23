import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

// Common validation schemas
export const dateRangeSchema = z.object({
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required',
  }),
}).refine((data) => data.startDate <= data.endDate, {
  message: 'Start date must be before end date',
  path: ['endDate'],
});

export const filterSchema = z.object({
  zones: z.array(z.string()).min(1, 'At least one zone must be selected'),
  dateRange: dateRangeSchema,
  chartType: z.enum(['bar', 'line', 'area']),
});

export const contractorSchema = z.object({
  contractor: z.string().min(1, 'Contractor name is required'),
  serviceProvided: z.string().min(1, 'Service description is required'),
  status: z.enum(['Active', 'Expired']),
  contractType: z.enum(['Contract', 'PO', 'N/A']),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  contractOMRMonth: z.string(),
  contractTotalOMRYear: z.string(),
  note: z.string(),
}).refine((data) => {
  if (data.startDate && data.endDate) {
    return data.startDate <= data.endDate;
  }
  return true;
}, {
  message: 'Start date must be before end date',
  path: ['endDate'],
});

// Generic form hook
export const useFormValidation = <T extends z.ZodType<any, any>>(
  schema: T,
  defaultValues?: Partial<z.infer<T>>,
  onSubmit?: (data: z.infer<T>) => void | Promise<void>
) => {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
    mode: 'onChange',
  });

  const handleSubmit = async (data: z.infer<T>) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
    } catch (error) {
      toast.error('Form submission failed');
      console.error('Form submission error:', error);
    }
  };

  const handleError = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      toast.error(firstError.message);
    }
  };

  return {
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit, handleError),
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
    errors: form.formState.errors,
  };
};

// Specific form hooks
export const useDateRangeForm = (
  defaultValues?: Partial<z.infer<typeof dateRangeSchema>>,
  onSubmit?: (data: z.infer<typeof dateRangeSchema>) => void
) => {
  return useFormValidation(dateRangeSchema, defaultValues, onSubmit);
};

export const useFilterForm = (
  defaultValues?: Partial<z.infer<typeof filterSchema>>,
  onSubmit?: (data: z.infer<typeof filterSchema>) => void
) => {
  return useFormValidation(filterSchema, defaultValues, onSubmit);
};

export const useContractorForm = (
  defaultValues?: Partial<z.infer<typeof contractorSchema>>,
  onSubmit?: (data: z.infer<typeof contractorSchema>) => void
) => {
  return useFormValidation(contractorSchema, defaultValues, onSubmit);
};