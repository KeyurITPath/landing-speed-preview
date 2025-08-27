import { useCallback, useEffect, useMemo } from 'react';
import { useFormik } from 'formik';
import { useTranslations } from 'next-intl';
import { cancelFeedbackValidation } from '@/utils/validations';
import { isEmptyObject } from '@/utils/helper';

const useFeedback = ({
  feedbackOptions,
  handleSaveFeedbackFormData,
  saveFeedBackFormData,
  handleCancel,
}: any) => {
  const t = useTranslations();

  const initialValues = {
    feedback: '',
    description: '',
  };

  const onSubmit = useCallback(
    async (values: any) => {
      await handleSaveFeedbackFormData(values);
      await handleCancel();
    },
    [handleCancel, handleSaveFeedbackFormData]
  );

  const {
    errors,
    values,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
  } = useFormik({
    initialValues,
    validationSchema: cancelFeedbackValidation(t),
    enableReinitialize: true,
    onSubmit,
  });

  const feedbackOptionsTransform = useMemo(() => {
    return feedbackOptions.map((option: any) => ({
      ...option,
      value: option.name,
      label: option.name,
    }));
  }, []);

  useEffect(() => {
    if (!isEmptyObject(saveFeedBackFormData)) {
      const { feedback, description } = saveFeedBackFormData || {};
      setValues({
        ...values,
        feedback: feedback || '',
        description: description || '',
      });
    }
  }, []);

  const formData = useMemo(() => {
    return [
      {
        id: 'feedback',
        name: 'feedback',
        value: values.feedback,
        handleChange,
        handleBlur,
        error: touched.feedback && errors.feedback,
        type: 'radio',
        options: feedbackOptionsTransform,
        row: false,
      },
      {
        id: `description`,
        name: `description`,
        value: values?.description,
        placeholder: 'Enter feedback description',
        handleChange,
        onBlur: handleBlur,
        error: touched?.description && errors?.description,
        type: 'text',
        rows: 4,
        multiline: true,
      },
    ];
  }, [
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    feedbackOptionsTransform,
  ]);

  return { formData, handleSubmit };
};

export default useFeedback;
