import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/dashboard/TopBar";
import SideBar from "../components/dashboard/SideBar";
import Modal from "../components/ui/Modal";
import SessionForm from "../components/dashboard/SessionForm";
import VocabularyForm from "../components/dashboard/VocabularyForm";
import BottomNav from "../components/dashboard/BottomNav";



function DashboardLayout() {
  // L'état qui pilote l'ouverture de la modale
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
   const [wordModalOpen, setWordModalOpen] = useState(false);
   const [refresh_key, setRefreshKey] = useState(0);

   function handleRefresh() {
    setRefreshKey((oldKey) => oldKey + 1);
   };
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#F5F3FB]">
      {/* on donne à la topbar le moyen d'ouvrir la modale */}
      <TopBar user="Belvin" onNewSession={() => setSessionModalOpen(true)} onNewWord={()=>setWordModalOpen(true)} />

      <div className="flex flex-1 gap-6 overflow-hidden px-6 py-6">
        <SideBar />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet context={{refresh_key}}/>
        </main>
      </div>
       <BottomNav />
      {/* La modale, au niveau du layout */}
      <Modal
        open={sessionModalOpen}
        onClose={() => setSessionModalOpen(false)}
        title="Nouvelle session"
      >
        <SessionForm onSuccess={() =>{ 
           setSessionModalOpen(false);
           handleRefresh();}} />
      </Modal>
      <Modal
        open={wordModalOpen}
        onClose={() => setWordModalOpen(false)}
        title="Nouveau mot"
      >
        <VocabularyForm onSuccess={() => {
          setWordModalOpen(false);
          handleRefresh();}} />
      </Modal>
    </div>
  );
}

export default DashboardLayout;