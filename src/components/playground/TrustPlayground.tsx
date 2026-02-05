import { useState, useCallback,useEffect } from "react";
import { usePlayground } from "@/hooks/usePlayground";
import { useIsMobile } from "@/hooks/use-mobile";
import { OrientationScreen } from "./OrientationScreen";
import { TopUtilityBar } from "./TopUtilityBar";
import { MobileTopBar } from "./MobileTopBar";
import { RoleSidebar } from "./RoleSidebar";
import { MobileRoleNav } from "./MobileRoleNav";
import { CenterStage } from "./CenterStage";
import { DevConsole } from "./DevConsole";
import { MobileDevConsole } from "./MobileDevConsole";
import { BottomFooter } from "./BottomFooter";

export function TrustPlayground() {
  const isMobile = useIsMobile();
  const [showPostVerificationCTA, setShowPostVerificationCTA] = useState(false);

  const {
    state,
    credentialSchemas,
    verificationRequests,
    startPlayground,
    setRole,
    setChain,
    toggleDevMode,
    toggleUiPreview,
    toggleBlockchainAnchoring,
    toggleConsole,
    setIssuerStep,
    updateIssuerConfig,
    generateIssuerKeys,
    selectSchema,
    addCustomSchema,
    getRandomIdentity,
    issueCredential,
    scanCredential,
    showConsentModal,
    acceptCredential,
    rejectCredential,
    presentToVerifier,
    selectVerificationRequest,
    generateVerificationQR,
    updateSharedAttributes,
    shareCredentialWithVerifier,
    cancelVerification,
    verifyCredential,
    resetPlayground,
  } = usePlayground();

  // Handle verification with post-verification CTA
  const handleVerify = useCallback(() => {
    verifyCredential();
    // Show post-verification CTA after a short delay
    setTimeout(() => {
      setShowPostVerificationCTA(true);
    }, 500);
  }, [verifyCredential]);

  // Handle reset with CTA dismissal
  const handleReset = useCallback(() => {
    setShowPostVerificationCTA(false);
    resetPlayground();
  }, [resetPlayground]);

    useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldStart = params.get("start") === "true";
    const devMode = params.get("dev") === "true";

    if (shouldStart && !state.hasStarted) {
      startPlayground(devMode);
    }
  }, [state.hasStarted, startPlayground, toggleDevMode, toggleConsole]);


  // Show orientation screen if not started
  if (!state.hasStarted) {
    return <OrientationScreen onStart={startPlayground} />;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Utility Bar - Responsive */}
      {isMobile ? (
        <MobileTopBar
          selectedChain={state.selectedChain}
          blockchainAnchoringEnabled={state.blockchainAnchoringEnabled}
          devModeEnabled={state.devModeEnabled}
          uiPreviewEnabled={state.uiPreviewEnabled}
          onChainChange={setChain}
          onBlockchainAnchoringToggle={toggleBlockchainAnchoring}
          onDevModeToggle={() => {
            toggleDevMode();
            if (!state.devModeEnabled) {
              toggleConsole();
            }
          }}
          onUiPreviewToggle={toggleUiPreview}
          onReset={handleReset}
        />
      ) : (
        <TopUtilityBar
          selectedChain={state.selectedChain}
          blockchainAnchoringEnabled={state.blockchainAnchoringEnabled}
          devModeEnabled={state.devModeEnabled}
          uiPreviewEnabled={state.uiPreviewEnabled}
          onChainChange={setChain}
          onBlockchainAnchoringToggle={toggleBlockchainAnchoring}
          onDevModeToggle={() => {
            toggleDevMode();
            if (!state.devModeEnabled) {
              toggleConsole();
            }
          }}
          onUiPreviewToggle={toggleUiPreview}
          onReset={handleReset}
        />
      )}

      {/* Mobile Role Navigation */}
      {isMobile && (
        <MobileRoleNav
          currentRole={state.currentRole}
          hasCredential={!!state.issuedCredential}
          hasWalletCredentials={state.walletCredentials.length > 0}
          hasVerificationResult={!!state.verificationResult}
          onRoleChange={setRole}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Role Sidebar - Hidden on mobile */}
        {!isMobile && (
          <RoleSidebar
            currentRole={state.currentRole}
            hasCredential={!!state.issuedCredential}
            hasWalletCredentials={state.walletCredentials.length > 0}
            hasVerificationResult={!!state.verificationResult}
            onRoleChange={setRole}
          />
        )}

        {/* Center Stage */}
        <CenterStage
          currentRole={state.currentRole}
          selectedChain={state.selectedChain}
          blockchainAnchoringEnabled={state.blockchainAnchoringEnabled}
          uiPreviewEnabled={state.uiPreviewEnabled}
          issuerConfig={state.issuerConfig}
          selectedSchema={state.selectedSchema}
          availableSchemas={[...credentialSchemas, ...state.customSchemas]}
          issuerStep={state.issuerStep}
          holderStep={state.holderStep}
          verifierStep={state.verifierStep}
          credential={state.issuedCredential}
          walletCredentials={state.walletCredentials}
          blockchainAnchor={state.blockchainAnchor}
          verificationResult={state.verificationResult}
          verificationRequests={verificationRequests}
          selectedVerificationRequest={state.selectedVerificationRequest}
          sharedAttributes={state.sharedAttributes}
          onUpdateIssuerConfig={updateIssuerConfig}
          onGenerateKeys={generateIssuerKeys}
          onSelectSchema={selectSchema}
          onAddCustomSchema={addCustomSchema}
          onSetIssuerStep={setIssuerStep}
          onGetRandomIdentity={getRandomIdentity}
          onIssueCredential={issueCredential}
          onScanCredential={scanCredential}
          onScanComplete={showConsentModal}
          onAcceptCredential={acceptCredential}
          onRejectCredential={rejectCredential}
          onPresentToVerifier={presentToVerifier}
          onSelectVerificationRequest={selectVerificationRequest}
          onGenerateVerificationQR={generateVerificationQR}
          onUpdateSharedAttributes={updateSharedAttributes}
          onShareCredential={shareCredentialWithVerifier}
          onCancelVerification={cancelVerification}
          onVerify={handleVerify}
        />

        {/* Right Developer Console - Desktop only, mobile uses drawer */}
        {!isMobile && state.devModeEnabled && (
          <DevConsole
            isOpen={state.consoleOpen}
            didDocument={state.didDocument}
            credential={state.issuedCredential}
            blockchainAnchor={state.blockchainAnchor}
            consoleEvents={state.consoleEvents}
            onClose={toggleConsole}
          />
        )}
      </div>

      {/* Mobile Dev Console Drawer */}
      {isMobile && state.devModeEnabled && (
        <MobileDevConsole
          isOpen={state.consoleOpen}
          didDocument={state.didDocument}
          credential={state.issuedCredential}
          blockchainAnchor={state.blockchainAnchor}
          consoleEvents={state.consoleEvents}
          onClose={toggleConsole}
        />
      )}

      {/* Bottom Footer */}
      <BottomFooter 
        showPostVerificationCTA={showPostVerificationCTA && !!state.verificationResult?.isValid}
        onDismissPostVerificationCTA={() => setShowPostVerificationCTA(false)}
      />
    </div>
  );
}
