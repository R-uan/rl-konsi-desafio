return $input.all().map((data) => {
  let lead = data.json;
  // Separate first name
  let splitName = lead.name.split(" ");
  // Remove any non-numeric character
  let phone = lead.phone.replace(/\D/g, "");
  // Check and add the country prefix if necessary
  if (!phone.startsWith("55")) phone = "55" + phone;
  // Add 9 to the phone number
  if (phone.length === 12) phone = phone.slice(0, 4) + "9" + phone.slice(4);
  // Add 0s to the start of the cpf if necessary
  let cpf = lead.cpf.padStart(11, "0");
  // Format float
  const releasedValue = parseFloat(lead.released_value).toFixed(2);
  // Calculate age
  const [day, month, year] = lead.birthdate.split("/");
  const birthDate = new Date(year, month - 1, day);
  const age = new Date().getFullYear() - birthDate.getFullYear();

  return {
    json: {
      name: lead.name,
      first_name: splitName[0],
      last_name: splitName[splitName.length - 1],
      cpf: cpf,
      age: age,
      phone: phone,
      birthdate: lead.birthdate,
      created_at: new Date(),
      released_value: parseFloat(releasedValue),
    },
  };
});
