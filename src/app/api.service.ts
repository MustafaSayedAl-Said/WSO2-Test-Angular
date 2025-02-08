import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'https://172.16.1.18:8246/v1/Documents/1.0/Documents/'
  auth = 'eyJ4NXQjUzI1NiI6Ik9EQm1NVFUwWmpKak9ESmtOR1kxWlRobVlqazJZVFl6TnpSall6SXpNVEJsWWpFME1XSmtZMkl4TmpnM09EZGpZV1E1WldaaE5XSTBOREEzWmpNNE5RPT0iLCJraWQiOiJnYXRld2F5X2NlcnRpZmljYXRlX2FsaWFzIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ==.eyJzdWIiOiJhZG1pbkBjYXJib24uc3VwZXIiLCJhcHBsaWNhdGlvbiI6eyJvd25lciI6ImFkbWluIiwidGllclF1b3RhVHlwZSI6bnVsbCwidGllciI6IlVubGltaXRlZCIsIm5hbWUiOiJEZWZhdWx0QXBwbGljYXRpb24iLCJpZCI6MSwidXVpZCI6ImZlY2RmZWFlLWFkODgtNGVkMC05MmZmLTA3YzdhZmY0YjA0ZCJ9LCJpc3MiOiJodHRwczpcL1wvMTcyLjE2LjEuMTg6OTQ0Nlwvb2F1dGgyXC90b2tlbiIsInRpZXJJbmZvIjp7IlVubGltaXRlZCI6eyJ0aWVyUXVvdGFUeXBlIjoicmVxdWVzdENvdW50IiwiZ3JhcGhRTE1heENvbXBsZXhpdHkiOjAsImdyYXBoUUxNYXhEZXB0aCI6MCwic3RvcE9uUXVvdGFSZWFjaCI6dHJ1ZSwic3Bpa2VBcnJlc3RMaW1pdCI6MCwic3Bpa2VBcnJlc3RVbml0IjpudWxsfX0sImtleXR5cGUiOiJQUk9EVUNUSU9OIiwicGVybWl0dGVkUmVmZXJlciI6IiIsInN1YnNjcmliZWRBUElzIjpbeyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkdldEF1dGhlcml6YXRpb24iLCJjb250ZXh0IjoiXC9hdXRoZXJpemF0aW9uXC8xLjAuMCIsInB1Ymxpc2hlciI6ImFkbWluIiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IlVubGltaXRlZCJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJETVNDYXRlZ29yaWVzIiwiY29udGV4dCI6IlwvdjFcL0NhdGVnb3JpZXNcLzEuMC4wIiwicHVibGlzaGVyIjoiYWRtaW4iLCJ2ZXJzaW9uIjoiMS4wLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiVW5saW1pdGVkIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkRNU0RpcmVjdG9yaWVzIiwiY29udGV4dCI6IlwvdjFcL0RpcmVjdG9yeVwvMS4wLjAiLCJwdWJsaXNoZXIiOiJhZG1pbiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJVbmxpbWl0ZWQifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiRE1TRG9jdW1lbnRzIiwiY29udGV4dCI6IlwvdjFcL0RvY3VtZW50c1wvMS4wLjAiLCJwdWJsaXNoZXIiOiJhZG1pbiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJVbmxpbWl0ZWQifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiRE1TTWV0YWRhdGFLZXlzIiwiY29udGV4dCI6IlwvdjFcL01ldGFkYXRhS2V5c1wvMS4wLjAiLCJwdWJsaXNoZXIiOiJhZG1pbiIsInZlcnNpb24iOiIxLjAuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJVbmxpbWl0ZWQifSx7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiRE1TVGFncyIsImNvbnRleHQiOiJcL3YxXC9UYWdzXC8xLjAuMCIsInB1Ymxpc2hlciI6ImFkbWluIiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IlVubGltaXRlZCJ9LHsic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJVcGxvYWRGaWxlIiwiY29udGV4dCI6IlwvRG9jdW1lbnRzXC91cGxvYWRcL3YxIiwicHVibGlzaGVyIjoiYWRtaW4iLCJ2ZXJzaW9uIjoidjEiLCJzdWJzY3JpcHRpb25UaWVyIjoiVW5saW1pdGVkIn0seyJzdWJzY3JpYmVyVGVuYW50RG9tYWluIjoiY2FyYm9uLnN1cGVyIiwibmFtZSI6IkRNU0RvY3VtZW50cyIsImNvbnRleHQiOiJcL3YxXC9Eb2N1bWVudHNcLzEuMCIsInB1Ymxpc2hlciI6ImFkbWluIiwidmVyc2lvbiI6IjEuMCIsInN1YnNjcmlwdGlvblRpZXIiOiJVbmxpbWl0ZWQifV0sInRva2VuX3R5cGUiOiJhcGlLZXkiLCJwZXJtaXR0ZWRJUCI6IiIsImlhdCI6MTczODE2NTY2MywianRpIjoiMjczN2Y4MzctZWMyMC00ZWE2LTg3MjMtN2Q0NThhZThlNDU1In0=.N4ixWanIfb45_DWwJJk8Mdj__TpXZWDcQEl-AhxxP7wxykPsFwLFdawOL2gQRhyTAHcK0xXvLqNRCLoFqyv_39s7u1t5ypwKiXJ10lkEtFpMEJitKgGGVcdrX2j9ZU1hPsugzujSWSmZUmXYVwzngy_l4sMvco0HzVdVqz74njWW9i9mXnPjV3m-l9TnkAYYXRxldgrQ0RPgsTGRr8uundeNzHsfOr44cKgPYw-SdFQgIXprdTH37ul3xm7JQ9UF22yT9r9xwIQZGNbX9slOl-y2rY-ZxsnICZJNh_ckVX7Tpriq9nuv9igj6BLD-sSxSfanTJ0g7Qj_WLEUK5sHKQ=='

  constructor(private http: HttpClient) { }

  addDocument(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('Name', 'Angular Test');
    formData.append('DirectoryId', 'a5438ddc-3e32-433d-6d77-08dd2b1fc56a');
    formData.append('CategoryId', '7b2820d1-3d20-44d7-8424-08dcfe554430');
    formData.append('Metadata', '{"refnumber":"677","radwa":"hghh","string":"hgfh","devtest":"hjhkj"}');

    let headers = new HttpHeaders();

    headers = headers.set('apikey', this.auth);
    headers = headers.set('Auth', this.auth);

    return this.http.post(this.baseUrl + 'upload/', formData, { headers }).pipe(
      map((response) => {
        console.log('Response: ', response);
        return true;
      }),
      catchError((err) => {
        console.error('Error Adding document: ', err);
        return of(false);
      })
    );;

  }

  downloadDocument(id: string) {
    let headers = new HttpHeaders();

    headers = headers.set('apikey', this.auth);
    headers = headers.set('Auth', this.auth);

    return this.http
    .get(this.baseUrl + id + "/download", {
      headers: headers,
      responseType: 'blob', // Set response type to 'blob'
      observe: 'response',
    })
    .pipe(
      map((response: HttpResponse<Blob>) => {
        // Create a blob from the response
        const blob = new Blob([response.body], { type: response.body.type });

        // Create a link element, set href to the blob URL, and trigger the download
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Revoke the object URL after the download
        window.URL.revokeObjectURL(url);

        return true;
      })
    );
  }
}
