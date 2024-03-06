import { flexbox } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const tests: React.FC = () => {
  function Child({ onMount }: any) {
    const [value, setValue] = useState(0);

    useEffect(() => {
      onMount([value, setValue]);
    }, [onMount, value]);

    return (
      <div>
        <p>Value: {value}</p>
      </div>
    );
  }
  function Parent() {
    let value = null;
    let setValue = null;

    const onChildMount = (dataFromChild: any) => {
      value = dataFromChild[0];
      setValue = dataFromChild[1];
    };

    // Call setValue to update child without updating parent

    return (
      <div>
        <p>Parent's value: {value}</p>
        <Child onMount={onChildMount} />
      </div>
    );
  }

  return <Parent />;
};
export default tests;
