export type StableDiffusionTheme = {
  /**
   * The name of the theme.
   */
  name: string;

  /**
   * Any extra words, including trigger words for LoRAs in this theme. Include a comma and spacing if you require it.
   */
  prompt_prefix?: string;

  /**
   * Any extra words, including trigger words for LoRAs in this theme. Include a command and spacing if you require it.
   */
  prompt_suffix?: string;

  /**
   * Any extra words, including trigger words for LoRAs in this theme. Include a comma and spacing if you require it.
   */
  negative_prompt_prefix?: string;

  /**
   * Any extra words, including trigger words for LoRAs in this theme. Include a command and spacing if you require it."
   */
  negative_prompt_suffix?: string;

  /**
   * URL or HuggingFace ID of the base model to generate the image. Examples: "stabilityai/stable-diffusion-xl-base-1.0", "runwayml/stable-diffusion-v1-5", "SG161222/Realistic_Vision_V2.0".
   */
  model_name: string;

  /**
   * The LoRAs to use for image generation. You can use any number of LoRAs and they will be merged together to generate the final image. MUST be specified as a json-serialized list that includes objects with the following params: - \'path\' (required)  - \'scale\' (optional, defaults to 1). Example: \'[{"path": "https://civitai.com/api/download/models/135931", "scale": 1}]
   */
  loras?: string[];

  /**
   * The same seed and prompt passed to the same version of StableDiffusion will output the same image every time
   */
  seed?: number;

  /**
   * The size of the generated image(s).
   * You can choose between these presets
   */
  image_size?:
    | "square_hd"
    | "square"
    | "portrait_4_3"
    | "portrait_16_9"
    | "landscape_4_3"
    | "landscape_16_9";

  /**
   * Increasing the number of steps tells Stable Diffusion that it should take more steps to generate your final result which can increase the amount of detail in your image.
   */
  num_inference_steps?: number;

  /**
   * The CFG(Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related image to show you.
   */
  guidance_scale?: number;

  /**
   * Skips part of the image generation process, leading to slightly different results. This means the image renders faster, too.
   */
  clip_skip?: number;

  /**
   * The architecture of the model to use. If a HF model is used, it will be automatically detected. Supported: ['sd', 'sdxl']
   */
  model_architecture?: "sd" | "sdxl";

  /**
   * Scheduler (or sampler) to use for the image denoising process. Possible values: ['DPM++ 2M', 'DPM++ 2M Karras', 'DPM++ 2M SDE', 'DPM++ 2M SDE Karras', 'Euler', 'Euler A']
   */
  scheduler?: string;

  /**
   * The format of the generated image. Possible values: ['jpeg', 'png']
   */
  image_format?: "jpeg" | "png";
};
