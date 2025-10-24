import { isValidPhoneNumber } from 'libphonenumber-js';
import * as Yup from 'yup';
import { PASSWORD_VALIDATOR_TYPE } from '../constants';

// Optimized email regex - simpler and faster
const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export const loginValidation = Yup.object().shape({
  email: Yup.string()
    .matches(EMAIL_REGEX, 'Must be a valid email')
    .required('Email is required'),
  // password: Yup.string()
  //     .min(8, 'Password must be at least 8 characters')
  //     .max(16, 'Password must not exceed 16 characters')
  //     .required('Password is required')
});

export const forgotPasswordValidation = Yup.object().shape({
  EmailAddress: Yup.string()
    .matches(EMAIL_REGEX, 'Must be a valid email')
    .required('Email is required'),
});

export const otpValidationSchema = Yup.object().shape({
  otp: Yup.string().min(6).max(6).required('Invalid OTP'),
});

export const newPasswordValidation = Yup.object().shape({
  new_password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .matches(/[0-9]/, 'Password must include at least one number')
    .matches(/[A-Z]/, 'Password must include at least one uppercase letter')
    .matches(
      /[^&\\;<>]*[^a-zA-Z0-9&\\;<>][^&\\;<>]*/,
      'Password must include at least one special character'
    )
    .required('New password is required'),
  confirm_password: Yup.string()
    .required('Confirm password is required')
    .oneOf(
      [Yup.ref('new_password'), ''],
      'Confirm password mismatch with new password.'
    ),
});

export const changePasswordValidation = Yup.object().shape({
  old_password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .matches(/[0-9]/, 'Password must be at least one number')
    .matches(
      /[^&\\;<>]*[^a-zA-Z0-9&\\;<>][^&\\;<>]*/,
      'Password must be at least one special character'
    )
    .required('Old password is required'),
  new_password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .matches(/[0-9]/, 'Password must be at least one number')
    .matches(
      /[^&\\;<>]*[^a-zA-Z0-9&\\;<>][^&\\;<>]*/,
      'Password must be at least one special character'
    )
    .required('New password is required'),
  confirm_password: Yup.string()
    .required('Confirm password is required')
    .oneOf(
      [Yup.ref('new_password'), ''],
      'Confirm password mismatch with new password.'
    ),
});

export const passwordCriteria = (value = '') => {
  const validations = {
    [PASSWORD_VALIDATOR_TYPE.ONE_NUMBER]: false,
    [PASSWORD_VALIDATOR_TYPE.ONE_UPPER_CASE]: false,
    [PASSWORD_VALIDATOR_TYPE.ONE_LOWER_CASE]: false,
    [PASSWORD_VALIDATOR_TYPE.ONE_SPECIAL_CHARACTER]: false,
    [PASSWORD_VALIDATOR_TYPE.EIGHT_CHARACTER_MIN]: false,
  };
  if (value?.length >= 8 && value?.length <= 16) {
    validations[PASSWORD_VALIDATOR_TYPE.EIGHT_CHARACTER_MIN] = true;
  }
  if (/[A-Z]/.test(value)) {
    validations[PASSWORD_VALIDATOR_TYPE.ONE_UPPER_CASE] = true;
  }
  if (/[a-z]/.test(value)) {
    validations[PASSWORD_VALIDATOR_TYPE.ONE_LOWER_CASE] = true;
  }
  if (/[0-9]/.test(value)) {
    validations[PASSWORD_VALIDATOR_TYPE.ONE_NUMBER] = true;
  }
  if (/[^&\\;<>]*[^a-zA-Z0-9&\\;<>][^&\\;<>]*/.test(value)) {
    validations[PASSWORD_VALIDATOR_TYPE.ONE_SPECIAL_CHARACTER] = true;
  }
  return validations;
};

export const openAccessNowValidation = (t: any) =>
  Yup.object().shape({
    email: Yup.string()
      .required(t('errors.email_required'))
      .matches(EMAIL_REGEX, t('errors.must_be_valid_email')),
    isAgreeTerms: Yup.boolean().oneOf([true], t('errors.must_agree_terms')),
  });

export const emailVerificationValidation = (t: any) =>
  Yup.object().shape({
    email: Yup.string()
      .trim()
      .required(t('errors.email_required'))
      .matches(EMAIL_REGEX, t('errors.must_be_valid_email')),
    confirmEmail: Yup.string()
      .trim()
      .required(t('errors.email_required'))
      .matches(EMAIL_REGEX, t('errors.must_be_valid_email')),
    phone: Yup.string()
      .trim()
      .test('is-valid-phone', 'Invalid Phone Number', function (value) {
        if (!value) {
          return true;
        } else {
          return isValidPhoneNumber('+' + value);
        }
      }),
  });

export const profileUpdateValidation = (t: any) =>
  Yup.object().shape({
    first_name: Yup.string()
      .trim()
      .required(t('errors.first_name_required'))
      .min(2, t('errors.first_name_min'))
      .max(50, t('errors.first_name_max'))
      .matches(/^[^\d]+$/u, t('errors.first_name_invalid')),
    last_name: Yup.string()
      .trim()
      .required(t('errors.last_name_required'))
      .min(2, t('errors.last_name_min'))
      .max(50, t('errors.last_name_max'))
      .matches(/^[^\d]+$/u, t('errors.last_name_invalid')),
    // location: Yup.string().required(t('errors.location_required')),
    // age: Yup.string().required(t('errors.age_required')),
    gender: Yup.string().required(t('errors.gender_required')),
  });

export const cancelFeedbackValidation = (t: any) =>
  Yup.object().shape({
    feedback: Yup.string().required(t('errors.feedback_required')),
  });
