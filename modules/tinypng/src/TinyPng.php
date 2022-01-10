<?php

namespace Drupal\tinypng;

use function Tinify\setKey as TinifySetKey;
use function Tinify\setAppIdentifier as TinifySetAppIdentifier;
use function Tinify\fromUrl as TinifyFromUrl;
use function Tinify\fromFile as TinifyFromFile;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\DependencyInjection\ContainerInjectionInterface;
use Drupal\Core\File\FileSystemInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Class TinyPng.
 *
 * @package Drupal\tinypng
 */
class TinyPng implements TinyPngInterface, ContainerInjectionInterface {

  /**
   * Config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * Config.
   *
   * @var \Drupal\Core\Config\ImmutableConfig
   */
  protected $config;

  /**
   * File system.
   *
   * @var \Drupal\Core\File\FileSystemInterface
   */
  protected $fileSystem;

  /**
   * TinyPNG API key.
   *
   * @var string
   */
  protected $apiKey;

  /**
   * Tinify Source.
   *
   * @var \Tinify\Source
   */
  protected $tinyfySource;

  /**
   * TinyPng service constructor.
   *
   * @param \Drupal\Core\Config\ConfigFactoryInterface $config_factory
   *   Config factory.
   * @param \Drupal\Core\File\FileSystemInterface $file_system
   *   File system.
   */
  public function __construct(
    ConfigFactoryInterface $config_factory,
    FileSystemInterface $file_system
  ) {
    $this->configFactory = $config_factory;

    $this->config = $this->configFactory->get('tinypng.settings');
    $this->fileSystem = $file_system;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('file_system')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function setApiKey($key = NULL, $reset = FALSE) {
    if (empty($this->apiKey) || $reset) {
      if (empty($key)) {
        $key = $this->config->get('api_key');
      }
      $this->apiKey = $key;
      TinifySetKey($key);
      TinifySetAppIdentifier('Drupal/' . \Drupal::VERSION);
    }
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function setFromUrl($url) {
    $this->setApiKey();
    $origin = file_create_url($url);
    $this->tinyfySource = TinifyFromUrl($origin);

    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function setFromFile($uri) {
    $this->setApiKey();
    $path = $this->fileSystem->realpath($uri);
    $this->tinyfySource = TinifyFromFile($path);

    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function saveTo($uri) {
    $path = $this->fileSystem->realpath($uri);
    return $this->tinyfySource->toFile($path);
  }

}
