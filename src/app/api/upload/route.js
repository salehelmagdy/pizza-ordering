import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import uniqid from "uniqid";

export async function POST(req) {
  // console.log(req);
  console.log(await req.formData());
  const data = await req.formData();

  if (data.get("file")) {
    console.log("we have file", data.get("file"));
    //upload the file
    const file = data.get("file");

    const s3Client = new S3Client({
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      },
    });

    const ext = file.name.split(".").slice(-1);
    console.log({ ext });

    const newFileName = uniqid() + "." + ext;
    console.log(newFileName);

    const chunks = [];
    for await (const chunk of file.stream()) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    const bucket = "saleh_food_ordering";
    await s3Client.send(
      new PutObjectCommand({
        Bucket: "saleh_food_ordering",
        Key: newFileName,
        ACL: "public-read",
        ContentType: file.type,
        Body: buffer,
      })
    );

    const link = "https://" + bucket + ".s3.amazonaws.com/" + newFileName;
    return Response.json(link);
  }
  return Response.json(true);
}
