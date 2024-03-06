import React, { useState } from 'react';

const useStage = () => {
  const [stage, setStage] = useState<string>();
  return {
    stage, setStage
  }
}
export default useStage;