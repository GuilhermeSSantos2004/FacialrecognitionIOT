import React, { useEffect, useMemo } from "react";
import { getComponentByCode } from "./dynamic-components";

type Props = {
  code: string;
  props?: any;
  uniqueKey?: string; // Adicione esta prop
};

const DynamicRenderer: React.FC<Props> = ({ code, props, uniqueKey }) => {
  const Component = useMemo(() => getComponentByCode(code), [code]);
  
  if (!Component) return null;

  return <Component key={uniqueKey} {...props} />;
};

export default DynamicRenderer;