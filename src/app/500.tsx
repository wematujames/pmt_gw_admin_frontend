import React from "react";
import { Button, Result } from "antd";

const App: React.FC = () => (
  <Result
    status="500"
    title="500"
    subTitle="Sorry, something went wrong."
    extra={
      <Button type="primary" href="/dashboard/financial">
        Back Home
      </Button>
    }
  />
);

export default App;
