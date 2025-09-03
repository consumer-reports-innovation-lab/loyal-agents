import React, { useEffect, useState } from "react";

const ContactFormComponent = ({
  form_fields,
  submit_button,
}: {
  form_fields: ContactFormFields;
  submit_button: SubmitButtonLabel;
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [invalidFields, setInvalidFields] = useState<InvalidField[] | null>(
    null
  );

  // staging formId and domain, overwritten in useEffect if live site
  const [formId, setFormId] = useState(20349);
  const [apiDomain, setApiDomain] = useState(
    "https://innovation.stage.consumerreports.org"
  );

  useEffect(() => {
    if (window.location.hostname.includes("loyalagents.org")) {
      setFormId(10907);
      setApiDomain("https://innovation.consumerreports.org");
    }
  }, []);

  const showValidationMessage = (field: string) => {
    return (
      <div className="text-red-500">
        {invalidFields?.find((f) => f.field === field)?.message}
      </div>
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        console.log(key, value);
        formDataToSend.append(key, value);
      });
      formDataToSend.append("_wpcf7_unit_tag", `${formId}`);

      const response = await fetch(
        `${apiDomain}/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`,
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();

      if (result.status === "mail_sent") {
        setSubmitStatus({
          success: true,
          message: result.message,
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          company: "",
          message: "",
        });
        setInvalidFields(null);
      } else {
        console.log("Form submit error", result.invalid_fields);

        setInvalidFields(result.invalid_fields ?? null);
        throw new Error(result.message || "Something went wrong");
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {submitStatus && submitStatus.success ? (
        // Show success message instead of form
        <div
          id="formSuccess"
          className="text-center py-12 px-6 bg-[#1B1B1B] rounded-lg border border-gray-600"
        >
          <div className="bg-gradient-to-br from-green-400 to-[#3A8DC7] flex items-center justify-center rounded-full p-3 w-16 h-16 mx-auto mb-6">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block align-middle scale-200"
            >
              <path
                d="M7 13.5L10.5 17L17 10.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Submission Successful!
          </h3>
          <p className="text-gray-300 text-lg">
            Check your email for further details.
          </p>
        </div>
      ) : (
        // Show form
        <form
          id="contactForm"
          className="space-y-8"
          onSubmit={handleSubmit}
          method="POST"
          data-netlify="true"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="block mb-3 font-sans text-sm font-bold tracking-wider text-white uppercase"
              >
                {form_fields.first_name.label}
                {form_fields.first_name.required && "*"}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                onChange={handleChange}
                value={formData.firstName}
                placeholder={form_fields.first_name.placeholder}
                required={form_fields.first_name.required}
                className={`px-4 py-3 w-full text-lg font-normal bg-[#1B1B1B] placeholder-gray-400 text-white rounded-full border focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent ${
                  invalidFields && invalidFields.find((f) => f.field == "firstName")
                    ? "border-red-200"
                    : "border-gray-600"
                }`}
              />
              {showValidationMessage("firstName")}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block mb-3 font-sans text-sm font-bold tracking-wider text-white uppercase"
              >
                {form_fields.last_name.label}
                {form_fields.last_name.required && "*"}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                onChange={handleChange}
                value={formData.lastName}
                placeholder={form_fields.last_name.placeholder}
                required={form_fields.last_name.required}
                className={`px-4 py-3 w-full text-lg font-normal bg-[#1B1B1B] placeholder-gray-400 text-white rounded-full border focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent ${
                  invalidFields && invalidFields.find((f) => f.field == "lastName")
                    ? "border-red-200"
                    : "border-gray-600"
                }`}
              />
              {showValidationMessage("lastName")}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="email"
                className="block mb-3 font-sans text-sm font-bold tracking-wider text-white uppercase"
              >
                {form_fields.email.label}
                {form_fields.email.required && "*"}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder={form_fields.email.placeholder}
                required={form_fields.email.required}
                className={`px-4 py-3 w-full text-lg font-normal bg-[#1B1B1B] placeholder-gray-400 text-white rounded-full border focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent ${
                  invalidFields && invalidFields.find((f) => f.field == "email")
                    ? "border-red-200"
                    : "border-gray-600"
                }`}
              />
              {showValidationMessage("email")}
            </div>

            <div>
              <label
                htmlFor="company"
                className="block mb-3 font-sans text-sm font-bold tracking-wider text-white uppercase"
              >
                {form_fields.company.label}
                {form_fields.company.required && "*"}
              </label>
              <input
                type="text"
                id="company"
                name="company"
                onChange={handleChange}
                value={formData.company}
                placeholder={form_fields.company.placeholder}
                required={form_fields.company.required}
                className={`px-4 py-3 w-full text-lg font-normal placeholder-gray-400 text-white bg-[#1B1B1B] rounded-full border  focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent ${
                  invalidFields && invalidFields.find((f) => f.field == "company")
                    ? "border-red-200"
                    : "border-gray-600"
                }`}
              />
              {showValidationMessage("company")}
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block mb-3 font-sans text-sm font-bold tracking-wider text-white uppercase"
            >
              {form_fields.message.label}
              {form_fields.message.required && "*"}
            </label>
            <textarea
              id="message"
              name="message"
              placeholder={form_fields.message.placeholder}
              onChange={handleChange}
              value={formData.message}
              required={form_fields.message.required}
              rows={8}
              className={`px-4 py-3 w-full text-lg font-normal placeholder-gray-400 text-white bg-[#1B1B1B] rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-vertical ${
                invalidFields && invalidFields.find((f) => f.field == "company")
                  ? "border-red-200"
                  : "border-gray-600"
              }`}
            ></textarea>
            {showValidationMessage("message")}
          </div>

          {submitStatus && !submitStatus.success && (
            <div
              id="formError"
              className="p-4 mb-4 rounded-lg bg-red-100 text-red-700"
            >
              {submitStatus.message}
            </div>
          )}

          <div>
            <button
              type="submit"
              id="submitButton"
              className="bg-gradient-to-br from-green-400 to-[#3A8DC7] text-white font-bold text-lg tracking-[0.36px] uppercase px-8 py-3 rounded-full hover:opacity-90 transition-opacity duration-300"
            >
              {isSubmitting ? "Sending..." : submit_button.text}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default ContactFormComponent;
