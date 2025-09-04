import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: "drhfcappf", // your Cloudinary cloud name
  api_key: "933558548416585", // your API key
  api_secret: "UE6GPXRg8NnAIl8B_5KA_saySW8", // your API secret
});

export default cloudinary.v2;
