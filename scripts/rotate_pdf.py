from pypdf import PdfReader, PdfWriter

def rotate_pdf(input_path, rotation_angle):
    """
    Rotates all pages in a PDF file by a given angle clockwise.
    Angles must be multiples of 90 (e.g., 90, 180, 270).
    """
    # Initialize reader and writer
    reader = PdfReader(input_path)
    writer = PdfWriter()

    # Loop through all pages and apply rotation
    for page in reader.pages:
        # Rotate the page content and dimensions safely
        page.rotate(rotation_angle)
        writer.add_page(page)

    # Save the modified document to a new file
    with open(input_path, "wb") as output_file:
        writer.write(output_file)
        
    print(f"Successfully rotated all pages by {rotation_angle}° and saved to: {input_path}")

# --- Example Usage ---
# Change 'input.pdf' to your actual file name
rotate_pdf("/mnt/c/Ken/project/prasit-website/resources/Thai_publications/2558-การศึกษาชาติพันธุ์ในภาคเหนือ.pdf", 270)