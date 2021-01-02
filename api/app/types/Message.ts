import PhoneNumber from "./PhoneNumber";

export default interface Message {
  id: number;
  
  toPhoneNumber: PhoneNumber['phoneNumber'];
  fromPhoneNumber: string;
  
  body: string;

  fromCity: string;
  fromZip: string;
  fromCountry: string;
}