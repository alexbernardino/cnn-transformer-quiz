export const questions = [
  {
    "section": "CNN foundations",
    "category": "Locality and weight sharing",
    "prompt": "In a standard convolutional layer, what do locality and weight sharing mean?",
    "options": [
      "Each response reads the whole image, and each position has its own independently learned filter.",
      "Each response reads a small spatial neighborhood, and the filter coefficients change independently at each position.",
      "Each response reads a small spatial neighborhood, and the same filter coefficients are reused at different positions.",
      "Each response reads the whole image, and one scalar output is shared by all positions."
    ],
    "answer": 2,
    "explanation": "Locality restricts the spatial region contributing to one response. Weight sharing reuses the learned filter across positions, producing a feature map with fewer parameters than separate local filters at every position. Different filters may still have different learned coefficients.",
    "activity": "Move one filter to a second image location. Its input values can change, but its learned coefficients stay the same.",
    "slides": [
      "Convolution: local connections and shared weights",
      "Convolution: shared filter, padding and stride"
    ]
  },
  {
    "section": "CNN foundations",
    "category": "Padding and stride",
    "prompt": "A 5 × 5 image is convolved with a 3 × 3 filter, zero padding a = 1 on every side and stride S = 2, with no dilation. Use output side = floor((input side + 2a − K)/S) + 1. What happens?",
    "options": [
      "Padding makes a 7 × 7 grid; the window moves two cells and gives a 3 × 3 output.",
      "Padding makes a 6 × 6 grid; the window moves two cells and gives a 2 × 2 output.",
      "Padding makes a 7 × 7 grid; the window moves one cell and gives a 5 × 5 output.",
      "Padding makes a 9 × 9 grid; the window moves three cells and gives a 3 × 3 output."
    ],
    "answer": 0,
    "explanation": "One added cell on both sides increases each input dimension from 5 to 7. Stride 2 moves the window two cells at a time. The output side is floor((5 + 2 − 3)/2) + 1 = 3. Padding width and stride describe different operations.",
    "activity": "Keep the same image, filter and padding but set S = 1. The output becomes 5 × 5.",
    "slides": [
      "Convolution: shared filter, padding and stride",
      "Convolutional layers: channels, shapes and parameters"
    ]
  },
  {
    "section": "CNN foundations",
    "category": "Convolution followed by ReLU",
    "prompt": "One input window has rows [2, 1] and [3, 4]. A ReLU convolutional unit uses a filter with rows [1, −1] and [0, 1], with bias b = −6. Using the CNN convention without reversing the filter, what are its preactivation s and output z?",
    "options": [
      "s = 5, z = 5",
      "s = −1, z = −1",
      "s = 1, z = 1",
      "s = −1, z = 0"
    ],
    "answer": 3,
    "explanation": "The filter response before the bias is 2(1) + 1(−1) + 3(0) + 4(1) = 5. Adding the bias gives s = −1. ReLU then changes this negative preactivation to z = 0.",
    "activity": "Set the bias to zero. The preactivation and ReLU output both become 5.",
    "slides": [
      "A numerical convolution",
      "Convolutional layers: channels, shapes and parameters"
    ]
  },
  {
    "section": "CNN foundations",
    "category": "Channels and parameter counts",
    "prompt": "A standard dense convolution receives a 10 × 10 × 3 input and uses F = 8 filters of size 3 × 3, stride 1, no padding, no dilation and one bias per filter. What are the output shape and parameter count?",
    "options": [
      "8 × 8 × 3 output; 224 parameters",
      "8 × 8 × 8 output; 224 parameters",
      "8 × 8 × 8 output; 80 parameters",
      "10 × 10 × 8 output; 216 parameters"
    ],
    "answer": 1,
    "explanation": "The spatial side is 10 − 3 + 1 = 8, and eight filters produce eight output channels. Each filter contains 3² × 3 = 27 weights plus one bias. The layer therefore has 8(27 + 1) = 224 trainable parameters, reused across all output positions.",
    "activity": "If the input were 20 × 20 × 3 instead, the output would be 18 × 18 × 8 while the parameter count would stay 224.",
    "slides": [
      "Convolutional layers: channels, shapes and parameters"
    ]
  },
  {
    "section": "CNN foundations",
    "category": "Pooling windows and channels",
    "prompt": "A max-pooling layer uses a 3 × 3 window and stride 2 on an input with eight channels. Which statement is correct?",
    "options": [
      "Neighboring windows do not overlap; pooling is applied separately within each channel and learns one bias per channel.",
      "Neighboring windows overlap; pooling takes a maximum across all eight channels and leaves one output channel.",
      "Neighboring windows overlap; pooling is applied separately within each channel and has no learned parameters.",
      "Neighboring windows do not overlap; pooling learns a 3 × 3 filter shared across the eight channels."
    ],
    "answer": 2,
    "explanation": "The window side K = 3 is larger than the stride S = 2, so adjacent windows overlap. Standard spatial max pooling operates independently in each channel, preserves the channel count and learns neither filters nor biases. Window size and stride are independent choices.",
    "activity": "Set the stride to 3 while keeping the window side at 3. Adjacent windows no longer overlap.",
    "slides": [
      "Pooling: window size and stride"
    ]
  },
  {
    "section": "CNN foundations",
    "category": "Flattening versus global averaging",
    "prompt": "The final CNN feature array has shape 4 × 4 × 8. How many features enter the classifier after flattening, and after global average pooling over spatial locations?",
    "options": [
      "Flattening: 16; global average pooling: 1",
      "Flattening: 128; global average pooling: 8",
      "Flattening: 128; global average pooling: 16",
      "Flattening: 8; global average pooling: 128"
    ],
    "answer": 1,
    "explanation": "Flattening retains all 4 × 4 × 8 = 128 values in one vector. Global average pooling averages the 16 spatial values separately within each of the eight channels, leaving one number per channel. It changes the readout, rather than learning another convolutional filter.",
    "activity": "For a direct three-class linear head with one bias per class, compare 128 × 3 + 3 = 387 parameters with 8 × 3 + 3 = 27.",
    "slides": [
      "From feature maps to class predictions"
    ]
  },
  {
    "section": "CNN foundations",
    "category": "End-to-end image classification",
    "prompt": "A CNN computes feature maps, converts them to one image vector r, and predicts class scores with a learned head. What does end-to-end training with a classification loss mean?",
    "options": [
      "Backpropagation from the classification loss jointly updates trainable parameters in the feature extractor and classifier.",
      "The classifier is trained first, and its predicted labels become fixed targets for every feature map.",
      "The feature extractor must be fixed because the training examples supply only class labels.",
      "Each intermediate feature map must have a separate manually supplied training label."
    ],
    "answer": 0,
    "explanation": "Intermediate representations are computed internally. The class label defines the final loss, and backpropagation carries its derivatives through the classifier and feature extractor. This allows useful features to be learned without specifying the desired values of individual feature maps.",
    "activity": "Identify the architectural choices fixed before training, such as filter sizes, and the quantities learned from data, such as filter coefficients.",
    "slides": [
      "A CNN learns a chain of image representations",
      "From feature maps to class predictions"
    ]
  },
  {
    "section": "CNN foundations",
    "category": "Where the parameters go",
    "prompt": "The AlexNet parameter table shows that its fully connected layers contain most of its weights. Which explanation best accounts for this concentration?",
    "options": [
      "Convolutional filters are fixed image-processing rules, so only the fully connected layers learn weights.",
      "Each convolutional filter contains one weight, regardless of its spatial size or input channel count.",
      "Max pooling adds a separate trainable weight for every input position, which is counted in the fully connected layers.",
      "A wide fully connected layer has a distinct weight for each input–output pair, whereas convolution reuses filter weights across spatial positions."
    ],
    "answer": 3,
    "explanation": "A fully connected layer with n inputs and q outputs has nq weights. Flattening a large feature array can therefore make a wide dense head very expensive. A convolution instead shares a fixed set of filter coefficients over its spatial output grid. Both kinds of weights are learned.",
    "activity": "Connect this observation to global average pooling: reducing the head's input width can greatly reduce its parameter count.",
    "slides": [
      "AlexNet: parameters and regularization",
      "From feature maps to class predictions",
      "Convolution: local connections and shared weights"
    ]
  },
  {
    "section": "Image encoding",
    "category": "Tokens and the classifier pipeline",
    "prompt": "In a Transformer image classifier, what is a token and how is it used?",
    "options": [
      "A token is a feature vector; the encoder updates token vectors, and a readout selects or combines their final information for classification.",
      "A token is a class label; the encoder repeatedly changes the training labels before classification.",
      "A token is an entire image stored as one scalar; the encoder converts that scalar directly into a class label.",
      "A token is a learned filter; the readout slides each token over the image to generate a feature map."
    ],
    "answer": 0,
    "explanation": "Tokens are vectors representing units of image information. Image encoding creates their initial representations, encoder blocks transform them, and the readout produces one image representation for the classifier. A token is neither a class label nor a convolutional filter.",
    "activity": "Identify the three stages for a patch-based ViT: patch encoding, token transformation, and classification from the final token information.",
    "slides": [
      "Transformer classifiers",
      "The token transformation chain",
      "Classification from the final tokens"
    ]
  },
  {
    "section": "Image encoding",
    "category": "Patch and token counts",
    "prompt": "A ViT splits a 224 × 224 RGB image into non-overlapping 16 × 16 patches, retaining all three channels in each patch. It then adds one CLS token. How many tokens enter the encoder?",
    "options": [
      "196 tokens: the CLS token replaces the first patch",
      "589 tokens: 196 tokens per colour channel and one CLS token",
      "197 tokens: 196 patch tokens and one CLS token",
      "257 tokens: 16 × 16 patch tokens and one CLS token"
    ],
    "answer": 2,
    "explanation": "There are 224/16 = 14 patches along each spatial axis, giving 14 × 14 = 196 patches. Each patch includes its RGB channels; the channels do not create separate tokens. Adding CLS gives T = 197.",
    "activity": "Keep the patch size at 16 × 16 and use a 384 × 384 image. There are 24 × 24 = 576 patch tokens, or 577 tokens including CLS.",
    "slides": [
      "Image encoding: patches",
      "Image encoding: positions and CLS"
    ]
  },
  {
    "section": "Image encoding",
    "category": "Shared patch projection",
    "prompt": "Flatten a 16 × 16 RGB patch into the row vector x_{i} with shape 1 × 768. To compute e_{i} = x_{i}E with embedding width D = 128, which description is correct? Ignore projection biases.",
    "options": [
      "E has shape 128 × 768 and is multiplied on the right of every patch row.",
      "E has shape 768 × 128, is shared across patches, and produces a 1 × 128 embedding.",
      "E has shape 768 × 128, but a different matrix must be learned for every patch position.",
      "E has shape 768 × 768, because embedding width must equal the number of patch values."
    ],
    "answer": 1,
    "explanation": "For row vectors, (1 × 768)(768 × 128) gives a 1 × 128 result. The same learned projection E encodes every patch. The chosen embedding width D need not equal the number of raw patch values.",
    "activity": "Count the projection weights: 768 × 128 = 98,304. Doubling the number of image patches does not double this parameter count.",
    "slides": [
      "Image encoding: patch embeddings"
    ]
  },
  {
    "section": "Image encoding",
    "category": "Learned positions and CLS",
    "prompt": "Consider inference on two different images with the same patch grid using the same trained ViT. What happens to the learned position vectors p_{i} and the initial CLS vector c?",
    "options": [
      "Both are computed from the pixels, so every p_{i} and c must change between images.",
      "The p_{i} are shared, but c is replaced by the image's correct class label at inference.",
      "The stored p_{i} and c are shared, so all final token representations must also be identical between images.",
      "The stored p_{i} and c are shared across images, while the CLS representation can become image-dependent inside the encoder."
    ],
    "answer": 3,
    "explanation": "Position vectors and the starting CLS vector are learned parameters, updated by backpropagation during training and reused at inference. A position vector acts as a position-specific addition to an embedding. CLS starts identically across images but exchanges information with image tokens, so its final representation can differ.",
    "activity": "Separate parameters from activations: c and p_{i} are stored parameters; a patch embedding x_{i}E and the final CLS representation are computed for the current image.",
    "slides": [
      "Image encoding: positions and CLS",
      "Training and transfer learning"
    ]
  },
  {
    "section": "Attention & classification",
    "category": "Projection weights versus activations",
    "prompt": "For one attention head, Q = ZW_{Q}, K = ZW_{K} and V = ZW_{V}. What changes when a trained model processes a different image at inference?",
    "options": [
      "The learned projection matrices are re-estimated from the new image; Z, Q, K and V stay fixed.",
      "Only V can change; Q and K are fixed learned parameter matrices.",
      "Only Z can change; fixed projection matrices force Q, K and V to stay fixed.",
      "The token matrix Z and the resulting Q, K and V can change; the learned projection matrices stay fixed."
    ],
    "answer": 3,
    "explanation": "W_{Q}, W_{K} and W_{V} are learned parameters shared across tokens and images for that head. The forward pass multiplies the current token representations by those matrices to compute queries, keys and values. Fixed weights can still produce different activations from different inputs.",
    "activity": "For row token z = (1, 2), let W_{Q} be the 2 × 2 identity matrix. Changing z to (3, 2) changes q even though W_{Q} is unchanged.",
    "slides": [
      "Queries, keys and values"
    ]
  },
  {
    "section": "Attention & classification",
    "category": "Scores and source-wise softmax",
    "prompt": "For receiver i, queries and keys are row vectors with d features. Which procedure correctly produces its attention weights? Here j indexes source tokens.",
    "options": [
      "Use s_{ij} = q_{i}k_{j}ᵀ/√d, then normalize exponentiated scores over source tokens j for each receiver i.",
      "Use s_{ij} = q_{i}k_{j}ᵀ/√d, then normalize exponentiated scores over receiving tokens i for each source j.",
      "Use s_{ij} = q_{i}v_{j}ᵀ/√d, then normalize exponentiated scores over source tokens j for each receiver i.",
      "Use s_{ij} = q_{i}k_{j}ᵀ/√d as the weight directly, without normalizing the scores."
    ],
    "answer": 0,
    "explanation": "The scaled query–key dot products measure receiver–source compatibility. For a fixed receiver i, softmax gives a_{ij} = exp(s_{ij}) divided by the sum of exp(s_{iℓ}) over all source tokens ℓ. Thus each row of A contains positive weights that sum to one; values are mixed only after these weights are obtained.",
    "activity": "If one receiver has three equal scores, each source receives weight 1/3. Changing the number of classes does not change this source-wise normalization.",
    "slides": [
      "Queries, keys and values",
      "Self-attention in matrix form"
    ]
  },
  {
    "section": "Attention & classification",
    "category": "Numerical attention mixture",
    "prompt": "For one receiver, scaled scores are (0, ln 2, 0) and scalar source values are (4, 0, 8). Use a_{ij} = exp(s_{ij}) / sum over sources of exp(s_{ij}), then o_{i} = sum over sources of a_{ij}v_{j}. What is o_{i}?",
    "options": [
      "2",
      "3",
      "4",
      "6"
    ],
    "answer": 1,
    "explanation": "Exponentiating the scores gives (1, 2, 1), whose sum is 4. The attention weights are therefore (1/4, 1/2, 1/4), and the output is (1/4)4 + (1/2)0 + (1/4)8 = 3. The largest weight is assigned to a source whose value happens to be zero.",
    "activity": "If all three scores become equal while the values stay fixed, the output becomes their ordinary mean: (4 + 0 + 8)/3 = 4.",
    "slides": [
      "One attention calculation",
      "Inside attention: a weighted mixture"
    ]
  },
  {
    "section": "Attention & classification",
    "category": "Input-dependent attention",
    "prompt": "Which statement correctly describes standard self-attention O = A(Z)V(Z) in this ViT?",
    "options": [
      "It is linear in Z because every receiver forms a weighted sum of value vectors.",
      "It is nonlinear in Z, but self-attention forces A_{ij} = A_{ji} for every pair of tokens.",
      "It is generally nonlinear in Z, and receiver i attending to j need not have the same weight as receiver j attending to i.",
      "It is linear in Z because A is a learned parameter matrix that stays fixed across images."
    ],
    "answer": 2,
    "explanation": "Although mixing is linear in V when A is held fixed, A is recomputed from the current tokens using query–key products and softmax. The complete map is therefore generally nonlinear. Different query and key projections, together with separate row normalization, mean that A need not be symmetric.",
    "activity": "Interpret A_{12} = 0.8 and A_{21} = 0.1: receiver 1 uses source 2 strongly, while receiver 2 uses source 1 weakly. These are compatible directed attention weights.",
    "slides": [
      "Inside attention: a weighted mixture",
      "Self-attention in matrix form"
    ]
  },
  {
    "section": "Attention & classification",
    "category": "Combining attention heads",
    "prompt": "Each of h attention heads returns O_{k} with shape T × d. How does multi-head attention combine these outputs to obtain T × D features?",
    "options": [
      "Concatenate the head features into T × hd, then multiply by learned W_{O} of shape hd × D.",
      "Stack the outputs as additional tokens, then apply a learned projection, producing hT token rows.",
      "Average the outputs across tokens, then apply a learned projection, producing one image vector.",
      "Concatenate the head features and call that result W_{O}; no learned output projection is used."
    ],
    "answer": 0,
    "explanation": "Concatenation joins the feature vectors from all heads for each token, so the number of token rows stays T. The resulting activation O_{cat} is multiplied by a separate learned matrix W_{O}. Each head has its own query, key and value projections and can compute a different mixture.",
    "activity": "For D = 768, h = 12 and d = 64, the concatenated width is 768 and W_{O} has shape 768 × 768. W_{O} is a parameter matrix, not the output of concatenation.",
    "slides": [
      "Multi-head self-attention"
    ]
  },
  {
    "section": "Attention & classification",
    "category": "Operations inside an encoder block",
    "prompt": "Which description correctly distinguishes LayerNorm, the shared MLP and self-attention within the ViT encoder block?",
    "options": [
      "LayerNorm computes statistics across the training mini-batch; the MLP and self-attention both process each token independently.",
      "LayerNorm averages all token vectors into one vector; the MLP then creates the missing token vectors again.",
      "LayerNorm normalizes the features within each token; the shared MLP exchanges information between tokens, while self-attention acts on each token separately.",
      "LayerNorm normalizes the features within each token; the shared MLP acts on each token separately, while self-attention exchanges information between tokens."
    ],
    "answer": 3,
    "explanation": "For a token with D features, LayerNorm uses the mean and variance of those D features, followed by learned feature-wise scale and shift. The same MLP is applied separately to every token. Self-attention performs the mixing across tokens, and residual additions retain each sublayer's input alongside its update.",
    "activity": "Mark the feature axis and token axis of Z with shape T × D. LayerNorm computes statistics along the feature axis within each row; attention uses information across rows.",
    "slides": [
      "Token transformations: one ViT block",
      "The token transformation chain"
    ]
  },
  {
    "section": "Attention & classification",
    "category": "CLS readout and class probabilities",
    "prompt": "In the ViT readout shown in the lecture, how is an image classified into m classes after the final encoder block?",
    "options": [
      "Use the initial learned CLS vector directly and normalize its D features as the class probabilities.",
      "Assign one output class to each patch token and apply softmax over the T tokens.",
      "Use the final normalized CLS vector as the image representation, map it to m scores with a learned head, and apply softmax over classes.",
      "Choose the source token receiving the largest attention weight and use its position index as the class label."
    ],
    "answer": 2,
    "explanation": "The final CLS representation has gathered image-dependent information through the encoder. A learned head maps its D features to m class scores, and class-wise softmax produces probabilities. This normalization is over classes, whereas attention softmax is over source tokens; the classification loss trains parameters throughout the model.",
    "activity": "For D = 128 and m = 10, W_{cls} has shape 128 × 10 and the bias has 10 entries. An alternative readout can average the final image-region token vectors before classification.",
    "slides": [
      "Classification: the ViT readout",
      "Classification from the final tokens",
      "Training and transfer learning"
    ]
  },
  {
    "section": "Attention & classification",
    "category": "Patch size and attention cost",
    "prompt": "For a fixed image resolution, halve both the patch width and patch height. Assume non-overlapping patches and global self-attention, and ignore CLS. How do the token count T and the number of scores T² per head change?",
    "options": [
      "The token count becomes 2 times larger; the number of scores becomes 4 times larger.",
      "The token count becomes 4 times larger; the number of scores becomes 16 times larger.",
      "The token count becomes 4 times larger; the number of scores becomes 4 times larger.",
      "The token count becomes 16 times larger; the number of scores becomes 256 times larger."
    ],
    "answer": 1,
    "explanation": "Halving patch side length doubles the number of patches along each spatial axis, giving four times as many tokens. Global attention compares every token with every source token, so the number of scores scales as (4T)² = 16T². This describes the score count, not a guaranteed 16-fold increase in the runtime of the entire model.",
    "activity": "For a 224 × 224 image, changing from 16 × 16 to 8 × 8 patches changes T from 196 to 784. Check that 784²/196² = 16.",
    "slides": [
      "Image encoding: patches",
      "CNN and ViT tradeoffs",
      "Exercise"
    ]
  }
];
