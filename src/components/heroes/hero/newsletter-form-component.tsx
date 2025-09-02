import React, { useEffect, useState } from "react";

const NewsletterFormComponent = ({
  email_placeholder_text,
  submit_button_text,
}: {
  email_placeholder_text: string;
  submit_button_text: string;
}) => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [invalidFields, setInvalidFields] = useState<InvalidField[] | null>(
    null
  );

  const showValidationMessage = (field: string) => {
    return (
      <div className="text-red-500">
        {invalidFields?.find((f) => f.field === field)?.message}
      </div>
    );
  };

  // staging formId and domain, overwritten in useEffect if live site
  const [formId, setFormId] = useState(20350);
  const [apiDomain, setApiDomain] = useState(
    "https://innovation.stage.consumerreports.org"
  );

  useEffect(() => {
    if (window.location.hostname.includes("loyalagents.org")) {
      setFormId(10906);
      setApiDomain("https://innovation.consumerreports.org");
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log("Form changed", formData);
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
          email: "",
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
    <div>
      {submitStatus && submitStatus.success ? (
        // Show success message instead of form
        <div
          id="formSuccess"
          className="p-4 mb-6 rounded-full bg-[#3F3F3F] flex gap-3 items-center w-full"
        >
          <div className="bg-gradient-to-br from-green-400 to-[#3A8DC7] flex items-center justify-center rounded-full p-2">
            <svg
              width="16"
              height="16"
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
          <span className="text-white text-lg">{submitStatus.message}</span>
        </div>
      ) : (
        // Show form
        <>
          <form
            onSubmit={handleSubmit}
            className="flex gap-1 md:gap-4 items-center mb-6 flex-col md:flex-row"
          >
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              placeholder={email_placeholder_text}
              required={true}
              className={`border rounded-full px-6 py-3 w-full text-white bg-[#3a3a3a] placeholder-[#9d9d9d] text-lg font-normal flex-1 focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                invalidFields && invalidFields.find((f) => f.field == "email")
                  ? "border-red-200"
                  : "border-[#3f3f3f]"
              }`}
            />
            {/* {showValidationMessage("email")} */}

            <button
              type="submit"
              className={`w-full md:w-fit bg-gradient-to-br from-green-400 to-[#3A8DC7] text-white font-bold text-lg tracking-wide uppercase px-6 py-3 rounded-full hover:text-black transition-all duration-300 whitespace-nowrap`}
            >
              {isSubmitting ? "Sending..." : submit_button_text}
            </button>
          </form>
          {submitStatus && !submitStatus.success && (
            <div
              id="formError"
              className="p-2 mb-4 rounded-full bg-red-100 text-red-700 flex gap-1 items-center w-fit pe-6"
            >
              <div className="bg-red-500 flex items-center justify-center rounded-full p-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  className="inline-block align-middle"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              {submitStatus.message}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NewsletterFormComponent;
