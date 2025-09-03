// declare global {
interface SubmitButtonLabel {
  text: string;
}

interface InvalidField {
  field: string;
  message: string;
}

interface NewsletterFormFields {
  email: {
    label: string;
    placeholder: string;
    required: boolean;
  };
}

interface ContactFormFields {
  first_name: {
    label: string;
    placeholder: string;
    required: boolean;
  };
  last_name: {
    label: string;
    placeholder: string;
    required: boolean;
  };
  email: {
    label: string;
    placeholder: string;
    required: boolean;
  };
  company: {
    label: string;
    placeholder: string;
    required: boolean;
  };
  message: {
    label: string;
    placeholder: string;
    required: boolean;
  };
}
// }
