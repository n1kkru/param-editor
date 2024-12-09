import styles from "./index.module.scss";
import "./index.scss";
import React, { useEffect, useState } from "react";
import * as ReactDOMClient from "react-dom/client";
import { checkResponse } from "./utils";

const container = document.getElementById("root") as HTMLElement;
const root = ReactDOMClient.createRoot(container!);

type TParam = {
  id: number;
  name: string;
};
type TParamValue = {
  paramId: number;
  value: string;
};
interface Model {
  paramValues: TParamValue[];
}
interface ParamEditorProps {
  params: TParam[];
  model: Model;
}
/* api */
const getModelApi = () =>
  fetch(`https://923a0b9f4b739d12.mokky.dev/model`).then((res) =>
    checkResponse<Model[]>(res)
  );

const getParamsApi = () =>
  fetch(`https://923a0b9f4b739d12.mokky.dev/params`).then((res) =>
    checkResponse<TParam[]>(res)
  );

const updateModelApi = (newParam : TParamValue[]) =>
  fetch(`https://923a0b9f4b739d12.mokky.dev/model/0`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "paramValues": newParam

    })
  })
  .then((res) => {
    console.log(res);
    
    checkResponse<TParamValue>(res)
  });

const ParamEditor = () => {
  const [params, setParams] = useState<TParam[]>();
  const [model, setModel] = useState<Model>({
    "paramValues": [
        {
            "paramId": 0,
            "value": ""
        }
    ]
  });

  const getModel = () => model.paramValues;

  useEffect(() => {
    getModelApi().then((data) => {
      setModel(data[0]);
    });

    getParamsApi().then((data) => {
      setParams(data);
    })
    
  }, []);

  return (
    <main className={styles.app}>
      <section className={styles.section}>
        <h1 className={styles.title}>Редактировать модель</h1>
        <div className={styles.editor}>
          {params?.map((param) => {
            return (
            <label key={param.id} className={styles.label}>
              {param.name}:
              <input
                className={styles.field}
                name={`input-${param.id}`}
                key={param.id}
                defaultValue={
                  model?.paramValues?.find((elem) => elem.paramId === param.id)
                    ?.value
                }
                onBlur={(e) => {
                  const newModel = model.paramValues.map((elem) => {

                    
                    return elem.paramId === param.id
                      ? {...model.paramValues[elem.paramId-1], value: e.target.value}
                      : {...model.paramValues[elem.paramId-1]}
                  });
                  updateModelApi(newModel)
                  setModel({paramValues: newModel})
                }}
              />
            </label>
          )})}
        </div>
      </section>
    </main>
  );
};

root.render(
  <React.StrictMode>
    <ParamEditor />
  </React.StrictMode>
);
