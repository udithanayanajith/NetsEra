import Signin from "@/components/Auth/SignIn";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Property",
};

const SigninPage = () => {
  return (
    <>
      <Breadcrumb pageName="Sign In Page" />

      <Signin
        isOpen={false}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
      />
    </>
  );
};

export default SigninPage;
