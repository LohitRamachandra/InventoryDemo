using DinkToPdf.Contracts;
using DinkToPdf;

namespace InventoryBeginners
{
    public class HtmlToPdfService
    {
        private readonly IConverter _converter;

        public HtmlToPdfService(IConverter converter)
        {
            _converter = converter;
        }

        public byte[] ConvertHtmlToPdf(string html)
        {
            // Implementation of HTML to PDF conversion using DinkToPdf library
            return _converter.Convert(new HtmlToPdfDocument
            {
                GlobalSettings = {
                    PaperSize = PaperKind.A4,
                    Orientation = Orientation.Portrait
                },
                Objects = {
                    new ObjectSettings
                    {
                        HtmlContent = html
                    }
                }
            });
        }
    }
}
