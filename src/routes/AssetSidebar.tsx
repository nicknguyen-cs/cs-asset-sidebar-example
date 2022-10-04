import Icon from "../images/assetsidebar.svg";
import { useEffect } from "react";
import { useState } from "react";
import ContentstackAppSDK from "@contentstack/app-sdk";
import Extension from "@contentstack/app-sdk/dist/src/extension";
import "@contentstack/venus-components/build/main.css";
import { FieldLabel, TextInput } from "@contentstack/venus-components";
import axios from "axios";

function AssetSidebarExtension() {
  const [metavalue, setMetaValue] = useState("");
  const [metaUID, setMetaUID] = useState("");

  useEffect(() => {
    setValues();
  }, []);

  function setValues() {
    ContentstackAppSDK.init().then(async function (appSdk) {
      let metaUID = appSdk.location.AssetSidebarWidget?.currentAsset._metadata.extensions[appSdk.locationUID][0].uid;
      setMetaUID(metaUID);
      var config = {
        method: "get",
        url: `https://api.contentstack.io/v3/metadata/${metaUID}`,
        headers: {
          api_key: "",
          authtoken: "",
          "Content-Type": "application/json",
        },
      };

      axios(config)
        .then(function (response) {
          setMetaValue(response.data.metadata.localMetaData.test);
        })
        .catch(function (error) {
          console.log(error);
        });
      })
    }

  //"csc8df14c09d059c94"
  async function updateValues() {
    ContentstackAppSDK.init().then(async function (appSdk) {
      let widget = appSdk.location.AssetSidebarWidget;
      let testData = (document.getElementById("metavalue") as HTMLInputElement)
        .value;
      if (!metaUID) {
        appSdk.metadata
          .createMetaData({
            entity_uid: widget?.currentAsset.uid,
            type: "asset",
            extension_uid: appSdk.locationUID,
            _content_type_uid: "sys_assets",
            localMetaData: {
              test: testData,
            },
          })
          .then((res: any) => {
            console.log(res);
          });
      } else {
        appSdk.metadata
          .updateMetaData({
            entity_uid: widget?.currentAsset.uid,
            type: "asset",
            extension_uid: appSdk.locationUID,
            _content_type_uid: "sys_assets",
            localMetaData: {
              test: testData,
            },
            uid: metaUID,
          })
          .then((res: any) => {
            console.log(res);
          });
      }
    });
  }

  return (
    <div className="asset-sidebar">
      <div className="asset-sidebar-container">
        <div className="asset-sidebar-icon">
          <img src={Icon} alt="icon" />
        </div>
        <div className="app-component-content">
          <h4>Asset Sidebar Widget - Oskar Test</h4>
          <div>
            <FieldLabel
              htmlFor="label"
              required={false}
              requiredText="*"
              testId="cs-field-label"
            >
              Some label
            </FieldLabel>

            <TextInput
              autoFocus
              id={"metavalue"}
              name={"metavalue"}
              placeholder="Type Something..."
              showCharacterCount={true}
              type="text"
              value={metavalue}
              width="full"
              willBlurOnEsc
            />
          </div>
          <p>
            <button onClick={updateValues}>Save</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AssetSidebarExtension;
