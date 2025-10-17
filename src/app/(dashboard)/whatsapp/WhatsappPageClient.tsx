'use client';

import dynamic from 'next/dynamic';

const WhatsappClient = dynamic(() => import('./WhatsappClient'), { ssr: false });

type Contact = { id: string; name: string; remoteJid: string };

export default function WhatsappPageClient({
  initialContacts,
  instanceSlug,
  availableInstanceNames,
}: {
  initialContacts: Contact[];
  instanceSlug: string;
  availableInstanceNames: string[];
}) {
  return (
    <WhatsappClient
      initialContacts={initialContacts}
      instanceSlug={instanceSlug}
      availableInstanceNames={availableInstanceNames}
    />
  );
}