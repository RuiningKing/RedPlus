const bloodTypes = ["O-", "O+", "B-", "B+", "A-", "A+", "AB-", "AB+"];

const isValidDonation = (donor, receiver) => {
  if (donor === "O-") return true;
  if (donor === "O+") return receiver.endsWith("+");
  if (donor === "B-") return receiver.includes("B");
  if (donor === "B+") return receiver.includes("B") && receiver.endsWith("+");
  if (donor === "A-") return receiver.includes("A");
  if (donor === "A+") return receiver.includes("A") && receiver.endsWith("+");
  if (donor === "AB-") return receiver.includes("AB");
  if (donor === "AB+") return receiver.includes("AB") && receiver.endsWith("+");
};

const donateTo = (donor) => {
  return bloodTypes.filter((receiver) => isValidDonation(donor, receiver));
};

const receiveFrom = (receiver) => {
  return bloodTypes.filter((donor) => isValidDonation(donor, receiver));
};

module.exports = {
  isValidDonation,
  donateTo,
  receiveFrom
};
