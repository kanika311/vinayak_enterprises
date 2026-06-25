import { redirect } from 'next/navigation';
import { ADMIN_BASE } from '@/lib/constants';

/** Legacy route — website forms use Leads & Quote Requests instead. */
export default function InquiriesRedirectPage() {
  redirect(`${ADMIN_BASE}/leads`);
}
