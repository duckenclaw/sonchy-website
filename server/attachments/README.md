# Attachments

Every file in this folder is attached to the mail sent by `POST /api/subscribe`.

- Drop the files in here, commit, and push — Railway redeploys and picks them up.
- They are read **once at server startup**, so a new file needs a restart/redeploy.
- Files starting with `.` and this `README.md` are skipped.
- Keep the total under ~10MB. Resend's hard cap is 40MB after base64 encoding, but
  large attachments hurt deliverability — link to big files instead of attaching them.

With the folder empty the server still boots and sends the mail without attachments,
logging a warning.
