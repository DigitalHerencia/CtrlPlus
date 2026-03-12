# Hugging Face Model Lock: Visualizer v1

## Decision

Lock v1 vehicle segmentation to:

- `keras/segformer_b1_cityscapes_1024`

## Why This Model

The current visualizer is still fallback-first, so v1 needs a model that is small enough to operationalize without turning preview generation into a GPU-only bottleneck.

`keras/segformer_b1_cityscapes_1024` is the current lock because it gives a practical middle ground:

- `segformer_b0`: lower footprint, but less headroom for difficult vehicle boundaries
- `segformer_b1`: `13.68M` parameters with MIT licensing
- `segformer_b5`: `81.97M` parameters, which is materially heavier for first production rollout

For CtrlPlus, the first milestone is reliable vehicle masking before wrap overlay compositing, not leaderboard chasing.

## Deploy Guidance

- Default provider assumption: self-hosted inference or dedicated endpoint
- Keep the current template fallback active while async inference is being rolled out
- Do not block scheduling on visualizer completion
- Record the model ID in environment configuration so preview jobs and docs stay aligned

## Env Lock

Add the following to runtime configuration:

```env
HUGGINGFACE_VISUALIZER_MODEL=keras/segformer_b1_cityscapes_1024
HUGGINGFACE_VISUALIZER_REVISION=main
HUGGINGFACE_VISUALIZER_PROVIDER=self-hosted
```

## Evaluation Criteria

Before changing the lock, compare candidate models on:

- license compatibility
- parameter size
- expected latency on the target GPU or endpoint tier
- deploy path for preview and production
- mask quality on vehicle photos, not only cityscapes samples

## References

- https://huggingface.co/keras/segformer_b0_cityscapes_1024
- https://huggingface.co/keras/segformer_b1_cityscapes_1024
- https://huggingface.co/keras/segformer_b5_cityscapes_1024
