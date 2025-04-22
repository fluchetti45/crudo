
namespace crudo.Models;
public partial class SentimentResponseDTO
{
    public List<double> probs { get; set; } = null!;

    public int pred { get; set; }

}