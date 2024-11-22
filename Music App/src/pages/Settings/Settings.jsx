import ChangeProfile from "../../components/ChangeProfile";

import "./Settings.css";
export default function Settings() {
  const inputs = [
    {
      id: "registerFirstName",
      name: "firstName",
      type: "text",
      errorMessage:
        "Requires a letter and minimum of 2 characters. Allowed signs are period, coma, hyphen, apostrophe",
      placeholder: "First Name",
      pattern: "^[A-Za-z][A-Za-z ,.'\\-]{0,24}[A-Za-z]$",
    },
    {
      id: "registerLasttName",
      name: "lastName",
      type: "text",
      errorMessage:
        "Requires a letter and minimum of 2 characters. Allowed signs are period, coma, hyphen, apostrophe",
      placeholder: "Last Name",
      pattern: "^[A-Za-z][A-Za-z ,.'\\-]{0,24}[A-Za-z]$",
    },
  ];

  return (
    <div>
      Settings
      <div>
        <ChangeProfile />

        {inputs.map((input) => (
          <div key={input.id} data-mdb-input-init className="form-outline mb-4">
            <input
              type={input.type}
              id={input.id}
              className="form-control"
              name={input.name}
              placeholder={input.placeholder}
              // value={values[input.name] || ""}
              // onChange={onChange}
              pattern={input.pattern}
              // onBlur={handleFocus}
              required
              // focused={focused[input.name]}
            ></input>
            <span className="errorMsg">{input.errorMessage}</span>
            <label className="form-label" htmlFor={input.id}>
              {input.placeholder}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
